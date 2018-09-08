import { GET_LISTINGS, PUT_LISTING, SET_STEP, ESCROW_SET } from './ui/searchform/SearchFormActions';

const initialState = {
	listings: [],
	step: '',
	escrow: false,
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
	} else if (action.type === ESCROW_SET) {
		const escrow = true;
		return Object.assign({}, state, { escrow });
	}


	return state;
};

export default listingsReducer;


