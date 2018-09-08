import store from "../../../store";
import AplusEscrows from "./../../../contracts/AplusEscrows.json";
import TruffleContract from "truffle-contract";
import Escrow from "./../../../models/Escrow";
import { encrypt, decrypt } from "./../../../util";

export const GET_OPEN_SALE_ORDERS = "GET_OPEN_SALE_ORDERS";
export const ADD_FULFILLMENT_ERROR = "DD_FULFILLMENT_ERROR";
export const REMOVE_SALE_ORDER = "REMOVE_SALE_ORDER";
export const SET_FULFILLMENT_STEP = "SET_FULFILLMENT_STEP";

const gasPrice = 20000000000;
const gas = 500000;
const canAccess = true;

const assignOpenSaleOrders = saleOrders => ({
  type: GET_OPEN_SALE_ORDERS,
  payload: saleOrders,
});

const getContract = async abi => {
  const Contract = TruffleContract(abi);
  Contract.setProvider(web3.currentProvider);
  const contract = await Contract.deployed();
  return contract;
};

const updateFulfillment = saleOrder => ({
  type: REMOVE_SALE_ORDER,
  payload: saleOrder,
});

const updateFulfillmentStep = step => ({
  type: SET_FULFILLMENT_STEP,
  step,
});

const showFulfillmentError = message => ({
  type: ADD_FULFILLMENT_ERROR,
  message,
});

export const getOpenSaleOrders = () => async dispatch => {
  const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
  const escrowsContract = await getContract(AplusEscrows);
  const escrowedDataHashes = await escrowsContract.getEscrowDataHashesBySeller(
    ownerAddress
  );
  const buyersForDataHashes = await Promise.all(
    escrowedDataHashes.map(dh => escrowsContract.getBuyersForDataHash(dh))
  );
  const escrowArrays = await Promise.all(
    escrowedDataHashes.map((dh, i) => {
      const buyers = buyersForDataHashes[i];
      return Promise.all(
        buyers.map(buyer => escrowsContract.escrows.call(dh, buyer))
      );
    })
  );
  const saleOrders = [].concat
    .apply([], escrowArrays)
    .map(array => new Escrow(array));
  dispatch(assignOpenSaleOrders(saleOrders));
};

export const clearFulfillmentError = () => async dispatch => {
  dispatch(showFulfillmentError(""));
};

export const fulfillSaleOrder = (
  dataHash,
  viewer,
  viewerPublicKey,
  ownerPrivateKey,
  saleOrder
) => async dispatch => {
  let file, decryptedData, reencrypted, viewerFile;

  const linnia = store.getState().auth.linnia;
  const escrowsContract = await getContract(AplusEscrows);
  const ipfs = linnia.ipfs;

  const record = await linnia.getRecord(dataHash);

  dispatch(updateFulfillmentStep("Retreiving record from Linnia . . ."));

  if (!record.dataHash) {
    dispatch(
      showFulfillmentError(
        "Unable to retreive record. Does a record with that dataHash exist?"
      )
    );
    return;
  }

  dispatch(updateFulfillmentStep("Pulling file from IPFS . . ."));

  try {
    file = await new Promise((resolve, reject) => {
      ipfs.cat(record.dataUri, (err, ipfsRed) => {
        err ? reject(err) : resolve(ipfsRed);
      });
    });
  } catch (e) {
    dispatch(
      showFulfillmentError(
        "Unable to pull file from storage. Does record have valid dataUri?"
      )
    );
    return;
  }

  dispatch(updateFulfillmentStep("Decrypting file . . ."));

  try {
    const encryptedData = file;
    decryptedData = await decrypt(ownerPrivateKey, encryptedData);
  } catch (e) {
    console.log(e);
    dispatch(
      showFulfillmentError(
        "Unable to decrypt file. Is the owner private key correct?"
      )
    );
    return;
  }

  dispatch(updateFulfillmentStep("Re-encrypting file for buyer . . ."));

  try {
    reencrypted = await encrypt(
      viewerPublicKey,
      decryptedData
    );
  } catch (e) {
    dispatch(
      showFulfillmentError(
        "Unable to encrypt file for viewer. Is the viewer public key correct?"
      )
    );
    return;
  }

  dispatch(updateFulfillmentStep("Adding file for buyer to IPFS . . ."));
  try {
    viewerFile = await new Promise((resolve, reject) => {
      ipfs.add(reencrypted, (err, ipfsRed) => {
        err ? reject(err) : resolve(ipfsRed);
      });
    });
  } catch (e) {
    console.log(e);
    dispatch(
      showFulfillmentError(
        "Unable to reupload viewer file. Please try again later."
      )
    );
    return;
  }

  const [owner] = await store.getState().auth.web3.eth.getAccounts();

  dispatch(
    updateFulfillmentStep("Creating new permissions record in Linnia . . .")
  );

  try {
    const { permissions } = await linnia.getContractInstances();
    await permissions.grantAccess(dataHash, viewer, record.dataUri, {
      from: owner,
      gasPrice,
      gas,
    });
  } catch (e) {
    console.error(e);
    dispatch(
      showFulfillmentError(
        "Transaction to ethereum network failed! Please check your console for errors."
      )
    );
    return;
  }

  dispatch(updateFulfillmentStep("Claiming reward for data . . ."));

  try {
    await escrowsContract.claimMoney(dataHash, viewer, {
      from: owner,
      gasPrice,
      gas,
    });
  } catch (e) {
    console.error(e);
    dispatch(
      showFulfillmentError(
        "Something went wrong when claiming money. Please try again!"
      )
    );
  }

  dispatch(updateFulfillment(saleOrder));
};
