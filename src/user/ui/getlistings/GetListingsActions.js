import store from '../../../store';
import AplusListings from './../../../contracts/AplusListings.json';
import AplusEscrows from './../../../contracts/AplusEscrows.json';
import TruffleContract from 'truffle-contract';
import Listing from './../../../models/Listing';
import Escrow from './../../../models/Escrow';

export const GET_LISTINGS = 'GET_LISTINGS';
export const PUT_LISTING = 'PUT_LISTING';
export const SET_STEP = 'SET_STEP';

const assignListings = (listings) => ({
	type: GET_LISTINGS,
	payload: listings,
});

const putListing = (listing) => ({
	type: PUT_LISTING,
	payload: listing,
});

const setStep = (step) => ({
	type: SET_STEP,
	step,
});

export const getListings = () => async (dispatch) => {
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

export const buyListing = (listing, publicKey) => async (dispatch) => {
	const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
	const escrowsContract = await getContract(AplusEscrows);

	dispatch(setStep('Creating a buy order . . . '));

	await escrowsContract.createEscrow(listing.dataHash, publicKey, { 
		value: listing.price,
		from: ownerAddress,
	});

	const escrow = await escrowsContract.escrows.call(listing.dataHash, ownerAddress);
	listing.escrow = escrow;

	dispatch(putListing(listing));
};

const getContract = async (abi) => {
	const Contract = TruffleContract(abi);
	Contract.setProvider(web3.currentProvider);
	const contract = await Contract.deployed();
	return contract;
};