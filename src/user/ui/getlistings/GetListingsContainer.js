import GetListings from './GetListings';
import {connect} from 'react-redux';
import { getListings, buyListing } from './GetListingsActions';

const mapStateToProps = (state, ownProps) => {
	const listings = state.listings.listings;
  const step = state.listings.step;

	return {
		listings,
    step,
	};
};

const mapDispatchToProps = (dispatch) => {
  return {
  	getListings() {
  		dispatch(getListings());
  	},
  	buyListing(listing, publicKey) {
  		dispatch(buyListing(listing, publicKey));
  	},
  };
};

const GetListingsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(GetListings);

export default GetListingsContainer;
