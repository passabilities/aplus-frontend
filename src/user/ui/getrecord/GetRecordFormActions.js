import store from '../../../store';
import { decrypt } from '../../../util';
import AplusFaucet from './../../../contracts/AplusFaucet.json';

export const GET_RECORD = 'GET_RECORD';
function assignRecord (record) {
  return {
    type: GET_RECORD,
    payload: record,
  };
}

const gasPrice = 20000000000;
const gas = 500000;

export function claimTokens (dataHash) {
  // Get Record from Linnia
  return async (dispatch) => {
    const [owner] = await store.getState().auth.web3.eth.getAccounts();
    const web3 = store.getState().auth.web3;
    var faucetContract = new web3.eth.Contract(AplusFaucet.abi, "0x54cb8dc65b4c93225fec2d462f07aae4e4ee691e");
    try{
      await faucetContract.methods.withdrawl("0xA90C8007Caf00fC9bf8178F25e40F6b48E26DCCA", 
      "0x1f1298f6b99034fbee1db00ddadd06258bb6b368", dataHash).send({
        from: owner,
        gasPrice,
        gas,
      });
    }catch(e){
      console.log(e);
    }
  };
}

export function getRecord (dataHash) {
  // Get Record from Linnia
  return async (dispatch) => {
    const { linnia } = store.getState().auth;
    const record = await linnia.getRecord(dataHash);
    dispatch(assignRecord(record));
  };
}

export function getDecryptedRecord (record, privateKey) {
  // Get Record from Linnia
  return async (dispatch) => {
    const { linnia } = store.getState().auth;
    const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
    const { dataUri } = await linnia.getPermission(record.dataHash, ownerAddress);

    const { ipfs } = store.getState().auth;
    ipfs.cat(dataUri, async (err, ipfsRes) => {
      if(err){
        console.log(err);
      }else{
        const encrypted = ipfsRes;

        // Try to decrypt with the provided key
        try {
          const decrypted = await decrypt(privateKey, encrypted);
          record.decrypted = JSON.stringify(decrypted).toString();
          dispatch(assignRecord(record));
        } catch (e) {
          console.log(e);
          return (alert('Error decrypting data. Probably wrong private key'));
        }
      }
    });
  };
}
