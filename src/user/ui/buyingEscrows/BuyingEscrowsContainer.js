import BuyingEscrows from './BuyingEscrows'
import {connect} from 'react-redux'
import { getOpenBuyingOrders, revokeOrder } from './BuyingEscrowsActions'

const mapStateToProps = (state, ownProps) => {
	const buyOrders = state.buyOrders;
	return {
		buyOrders
	};
}

const mapDispatchToProps = (dispatch) => {
  return {
		getOpenBuyingOrders() {
  		dispatch(getOpenBuyingOrders())
		},
		revokeOrder(dataHash) {
  		dispatch(revokeOrder(dataHash))
  	},
  };
}

const BuyingEscrowsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(BuyingEscrows)

export default BuyingEscrowsContainer;
