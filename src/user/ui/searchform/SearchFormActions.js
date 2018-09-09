import AplusListings from './../../../contracts/AplusListings.json';
import Listing from './../../../models/Listing';
import AplusEscrows from './../../../contracts/AplusEscrows.json';
import Escrow from './../../../models/Escrow';
import TruffleContract from 'truffle-contract';
import store from '../../../store';
var request = require('request');

export const MAKE_SEARCH = 'MAKE_SEARCH';
export const GET_LISTINGS = 'GET_LISTINGS';
export const PUT_LISTING = 'PUT_LISTING';
export const SET_STEP = 'SET_STEP';
export const ESCROW_SET = 'ESCROW_SET';

function assignSearch (search) {
  return {
    type: MAKE_SEARCH,
    payload: search,
  };
}

const assignListings = (listings) => ({
	type: GET_LISTINGS,
	payload: listings,
});

const setEcrow = (escrow) => ({
	type: ESCROW_SET,
	escrow,
});

export function buy (dataHash, price) {
  return async function (dispatch) {
    const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
    const escrowsContract = await getContract(AplusEscrows);

    var publicKey = prompt('Enter you Public Key');
  
    dispatch(setEcrow(true));
    await escrowsContract.createEscrow(dataHash, publicKey, {
      value: price*1000000000000000000,
      from: ownerAddress,
    });
  
    //await escrowsContract.escrows.call(dataHash, ownerAddress);
  };
}

export function search (property) {
  // Get Record from Linnia
  return async function (dispatch) {
    let req = process.env.LINNIA_SEARCH_URI + '/records';
    if (property) {
      req = req + '?property=' + property;
    }

    const linnia = store.getState().auth.linnia;

    request(req, async (error, response, body) => {
      if (error) {
        console.error(error.stack);
      }

      const resArray = JSON.parse(body)
      // dispatch(assignSearch(resArray));

      const resultsArray = resArray.map( async (serverRecord) => {
        const record = await linnia.getRecord(serverRecord.dataHash)
        serverRecord.sigCount = Number(record.sigCount.toString())

        return serverRecord
      } )
      const results = await Promise.all(resultsArray)

      dispatch(assignSearch(results));
    });

    const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
    const listingsContract = await getContract(AplusListings);
    const escrowsContract = await getContract(AplusEscrows);
  
    const listedDataHashes = await listingsContract.getListedDataHashes();
    const escrowedDataHashes = await escrowsContract.getEscrowDataHashesByBuyer(ownerAddress);
    const escrowArrays = await Promise.all(escrowedDataHashes.map(dh => escrowsContract.escrows.call(dh, ownerAddress)));
    const escrows = {};
  
    escrowArrays.forEach((array) => {
      const escrow = new Escrow(array);
      escrows[escrow.dataHash] = escrow;
    });
  
    const listings = await Promise.all(listedDataHashes.map(async (dataHash) => {
      const solidityArray = await listingsContract.getListing(dataHash);
      const escrow = escrows[dataHash];
      return new Listing(solidityArray, dataHash, escrow);
    }));
  
    dispatch(assignListings(listings));
  };
}

const getContract = async (abi) => {
	const Contract = TruffleContract(abi);
	Contract.setProvider(web3.currentProvider);
	const contract = await Contract.deployed();
	return contract;
};
