import { 
	GET_OPEN_SALE_ORDERS, 
	ADD_FULFILLMENT_ERROR,
	REMOVE_SALE_ORDER,
	SET_FULFILLMENT_STEP,
} from './ui/approvesaleorders/ApproveSaleOrdersActions';

const initialState = {
	saleOrders: [],
	error: '',
};

const saleOrdersReducer = (state = initialState, action) => {
	if (action.type === GET_OPEN_SALE_ORDERS) {
		const saleOrders = action.payload;
		return Object.assign({}, state, { saleOrders });
	} else if (action.type === ADD_FULFILLMENT_ERROR) {
		const error = action.message;
		const step = '';
		return Object.assign({}, state, { error, step });
	} else if (action.type === REMOVE_SALE_ORDER) {
	    const index = state.saleOrders.indexOf(action.payload);
	    const saleOrders = state.saleOrders.slice();
	    saleOrders.splice(index, 1);
	    const step = '';
	    return Object.assign({}, state, { saleOrders, step });
	} else if (action.type === SET_FULFILLMENT_STEP) {
		const step = action.step;
		return Object.assign({}, state, { step });
	}

	return state;
};

export default saleOrdersReducer;


