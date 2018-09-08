import ApproveSaleOrders from './ApproveSaleOrders';
import {connect} from 'react-redux';
import { getOpenSaleOrders, fulfillSaleOrder } from './ApproveSaleOrdersActions';

const mapStateToProps = (state, ownProps) => {
	const saleOrders = state.saleOrders.saleOrders;
  const error = state.saleOrders.error;
  const step = state.saleOrders.step;

	return {
		saleOrders,
    error,
    step,
	};
};

const mapDispatchToProps = (dispatch) => {
  return {
  	getOpenSaleOrders() {
  		dispatch(getOpenSaleOrders());
  	},
    fulfillSaleOrder(dataHash, viewer, viewerPublicKey, ownerPrivateKey, saleOrder) {
      dispatch(fulfillSaleOrder(
        dataHash, 
        viewer, 
        viewerPublicKey, 
        ownerPrivateKey,
        saleOrder
      ));
    },
  };
};

const ApproveSaleOrdersContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ApproveSaleOrders);

export default ApproveSaleOrdersContainer;
