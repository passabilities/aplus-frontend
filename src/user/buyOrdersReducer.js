import { GET_BUY_ORDERS, REVOKE_BUY_ORDER } from './ui/buyingEscrows/BuyingEscrowsActions';

const initialState = [];

const buyOrdersReducer = (state = initialState, action) => {
	if (action.type === GET_BUY_ORDERS) {
		return Object.assign([], state, action.payload);
	}else if(action.type === REVOKE_BUY_ORDER) {
		const array = state.slice();
		const orderIndex = array.findIndex((element) => {
			return element[4] === action.payload;
		})
		array.splice(orderIndex, 1);
		return Object.assign([], state, array);
	}

	return state;
};

export default buyOrdersReducer;


