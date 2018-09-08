import store from '../../../store';
import axios from 'axios';
import AplusListings from './../../../contracts/AplusListings.json';
import TruffleContract from 'truffle-contract';

export const SET_SELLDATA = "SET_SELLDATA";
export const SET_STEP = 'SET_STEP';

const assignSellData = (selldata) => ({
    type: SET_SELLDATA,
    payload: selldata,
  });

const setStep = (step) => ({
  type: SET_STEP,
  step,
});

export const getSellData = () => async (dispatch) => {
    const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
    const host = process.env.LINNIA_SEARCH_URI;
    const url = `${host}/records?owner=${ownerAddress.toLowerCase()}`;
    const response = await axios.get(url);
    dispatch(assignSellData(response.data));
  };

export const createListing = (data, price) => async (dispatch) => {
  const [ownerAddress] = await store.getState().auth.web3.eth.getAccounts();
  const listingsContract = await getContract(AplusListings);

  dispatch(setStep('Creating your listing . . . '));

  await listingsContract.createListing(data.dataHash, price, { 
    from: ownerAddress,
    gas: 200000,
    gasPrice: 40000000000,
  });

  dispatch(setStep(''));
};

const getContract = async (abi) => {
	const Contract = TruffleContract(abi);
	Contract.setProvider(web3.currentProvider);
	const contract = await Contract.deployed();
	return contract;
};