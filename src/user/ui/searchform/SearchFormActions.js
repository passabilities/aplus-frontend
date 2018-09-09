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

      const resArray = JSON.parse(body);
      dispatch(assignSearch(resArray));

      const tcrUserHashes = await fetch('https://api-ropsten.etherscan.io/api?module=logs&action=getLogs&fromBlock=4000000&toBlock=latest&address=0xb9d7152FAF3685732d5D67baDc4fC58af0E65a81&topic0=0xc4497224aa78dd50c9b3e344aab02596201ca1e6dca4057a91a6c02f83f4f6c1')
        .then((res) => res.json())
        .then(({ result }) => result.map(({ topics: [ , address ] }) => address));

      const expertUsers = [
        [ '0xddb0dd83c8b70baf9950b9bb7e8d0bf23ecf2c78', '0xe01c42921acb55c60350dacc092b60329f1b6abdecc81400c447d47dd6344a96' ],
        [ '0x6a2c0788f525968ac39c0b6a57c9dd09caff0102', '0x307cfab69cf3ee922fceeb996c7b1a44513298db3badc6d2a0b732e6f1f27085' ],
        [ '0xf2bbbb4d5984af68009a34e7d640a521c4c5e677', '0x4db8f51cc0a9a4f71b8196cf2e60141fb69b999922b6ef19882655ab7d1a1f56' ],
        [ '0xc4b5bd2b13bebc95644c79340cf9375d9cb75206', '0x949829c688b91b09f5ebaa396bd65842ed022b370321f98dbfdea767ade32774' ],
        [ '0x7423fe4d8609eb56383dbd4731f0cb92b79f41fe', '0x4b081ca93d99b13928e027732f505e644691cbab51e3daad3f2e068b649b67c2' ],
        [ '0xe6cce27f668c11ef211f8db8471af435b8e5548b', '0xe3d311494ff8cb5762a17375479e6d1785842edf23205516cfcfc06586a8fe04' ],
        [ '0xa067e3ce12828afcd5bac9efa43ea13573345908', '0xb8bb68d27320a4dde494da4d8cde39f6cd5b6eda69748353886942faf0dd4dc0' ],
        [ '0x944cf20ce46b688bd38e765cbf712437cec7015e', '0x70161da9e6ce9a832ee702df34c04bdacf570c51db1a237c3f140abf18521680' ],
      ];

      const list = [];
      tcrUserHashes.forEach((userHash) => {
        expertUsers.forEach((expert) => {
          const [ address, hash ] = expert;
          if (hash === userHash)
            list.push(expert);
        });
      });
      console.log(list);

      const resultsArray = resArray.map( async (serverRecord) => {
        let tcrCount = 0;
        for (const [ address ] of list) {
          const exists = await records.sigExists(serverRecord.dataHash, address);
          console.log(exists);
          if (exists) tcrCount++;
        }

        const record = await linnia.getRecord(serverRecord.dataHash);
        serverRecord.sigCount = Number(record.sigCount.toString());
        serverRecord.tcrCount = tcrCount;

        return serverRecord;
      } );
      const results = await Promise.all(resultsArray);

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
