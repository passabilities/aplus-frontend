import store from '../../../store';
import { decrypt } from '../../../util';

export const GET_RECORD = 'GET_RECORD';
function assignRecord (record) {
  return {
    type: GET_RECORD,
    payload: record,
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
