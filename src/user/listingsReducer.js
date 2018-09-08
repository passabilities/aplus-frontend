import { GET_LISTINGS, PUT_LISTING, SET_STEP } from './ui/getlistings/GetListingsActions';

const initialState = {
	listings: [],
	step: '',
};

const listingsReducer = (state = initialState, action) => {
	if (action.type === GET_LISTINGS) {
		const listings = action.payload;
		return Object.assign({}, state, { listings });
	} else if (action.type === PUT_LISTING) {
		const listings = state.listings.slice();
		const listingIndex = listings.findIndex((element) => {
			return element.dataHash === action.payload.dataHash;
		});

		const step = '';

		listings[listingIndex] = action.payload;
		return Object.assign({}, state, { listings, step });
	} else if (action.type === SET_STEP) {
		const step = action.step;
		return Object.assign({}, state, { step });
	}

	return state;
};

export default listingsReducer;


