import { connect } from 'react-redux';
import SearchForm from './SearchForm';
import { search, buy } from './SearchFormActions';

const mapStateToProps = (state, ownProps) => {
  return { search: state.search, listings: state.listings.listings, escrow: state.listings.escrow };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchSubmit: (property) => {
      dispatch(search(property));
    },
    onBuy: (dataHash, price) => {
      dispatch(buy(dataHash, price));
    },
  };
};

const SearchFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);

export default SearchFormContainer;
