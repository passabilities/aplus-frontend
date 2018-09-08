import { connect } from 'react-redux';
import SearchForm from './SearchForm';
import { search } from './SearchFormActions';

const mapStateToProps = (state, ownProps) => {
  return { search: state.search };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchSubmit: (property) => {
      dispatch(search(property));
    },
  };
};

const SearchFormContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm);

export default SearchFormContainer;
