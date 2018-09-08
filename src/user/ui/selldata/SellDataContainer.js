import SellData from './SellData'
import {connect} from 'react-redux'
import {getSellData, createListing } from './SellDataActions'

const mapStateToProps = (state, ownProps) => {

  const sellData = state.selldata.selldata;
  const step = state.selldata.step;

  return {
    sellData,
    step
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSellData: () => {
        dispatch(getSellData())
      },
    createListing(data, price) {
        dispatch(createListing(data, price))
    }
  }
}

const SellDataContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SellData)

export default SellDataContainer
