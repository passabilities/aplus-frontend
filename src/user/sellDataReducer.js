const initialState = {
    selldata : [],
};
import {SET_SELLDATA, SET_STEP} from './ui/selldata/SellDataActions';
  
  const sellDataReducer = (state = initialState, action) => {
    if (action.type === SET_SELLDATA) {
      return Object.assign({}, state, {
        selldata: action.payload,
        step: '',
      });
    } else if (action.type === SET_STEP) {
      const step = action.step;

      return Object.assign({}, state, {
        step,
      });

    }
  
    return state;
  };
  
  export default sellDataReducer;
  