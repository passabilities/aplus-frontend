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
    const { records } = await linnia.getContractInstances();

    request(req, async (error, response, body) => {
      if (error) {
        console.error(error.stack);
      }

      const resArray = JSON.parse(body)
      dispatch(assignSearch(resArray));

      const tcrExperts = await fetch('https://api-ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=4000000&toBlock=latest&address=0xb9d7152FAF3685732d5D67baDc4fC58af0E65a81&topic0=0xc4497224aa78dd50c9b3e344aab02596201ca1e6dca4057a91a6c02f83f4f6c1')
        .then((res) => res.json())
        .then(({ result }) => result.map(({ topics: [ , address ] }) => address))

      const resultsArray = resArray.map( async (serverRecord) => {
        let tcrCount = 0
        for (const expert of tcrExperts) {
          const exists = await records.sigExists(serverRecord.dataHash, expert)
          if (exists) tcrCount++
        }

        const record = await linnia.getRecord(serverRecord.dataHash)
        serverRecord.sigCount = Number(record.sigCount.toString())
        serverRecord.tcrCount = tcrCount

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
