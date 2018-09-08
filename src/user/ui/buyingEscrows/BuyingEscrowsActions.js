import store from '../../../store';
import DDexEscrows from './../../../contracts/DDexEscrows.json';
import TruffleContract from 'truffle-contract';

export const GET_BUY_ORDERS = 'GET_BUY_ORDERS';
export const REVOKE_BUY_ORDER = 'REVOKE_BUY_ORDER';

const assignBuyingOrders = (buyOrders) => ({
	type: GET_BUY_ORDERS,
	payload: buyOrders
});

const revokeBuyingOrder = (buyOrder) => ({
	type: REVOKE_BUY_ORDER,
	payload: buyOrder
});


export const getOpenBuyingOrders = () => async (dispatch) => {
	const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts()
	const { linnia } = store.getState().auth
	const escrowsContract = await getContract(DDexEscrows);
	const escrowedDataHashes = await escrowsContract.getEscrowDataHashesByBuyer(ownerAddress);
	const escrowArrays = await Promise.all(escrowedDataHashes.map(dh => escrowsContract.escrows.call(dh, ownerAddress)));
	const permissions = await Promise.all(escrowArrays.map(escrow => linnia.getPermission(escrow[4], ownerAddress)));
	const results = escrowArrays.map( (escrow, i) => {
		escrow.push(permissions[i].dataUri)
		return escrow
	} )

	dispatch(assignBuyingOrders(results));
};

export const revokeOrder = (dataHash) => async (dispatch) => {
	const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts()
	const escrowsContract = await getContract(DDexEscrows);
	await escrowsContract.revokeEscrow(dataHash, { 
		from: ownerAddress,
		gas: 200000,
		gasPrice: 40000000000
	  });

	dispatch(revokeBuyingOrder(dataHash));
};

const getContract = async (abi) => {
	const Contract = TruffleContract(abi);
	Contract.setProvider(web3.currentProvider);
	const contract = await Contract.deployed();
	return contract;
};