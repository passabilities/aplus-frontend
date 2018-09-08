import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import authReducer from './auth/authReducer';
import recordReducer from './user/recordReducer';
import searchReducer from './user/searchReducer';
import permissionsReducer from './user/permissionsReducer';
import selldataReducer from './user/sellDataReducer';
import listingsReducer from './user/listingsReducer';
import saleOrdersReducer from './user/saleOrdersReducer';
import buyOrdersReducer from './user/buyOrdersReducer';

const reducer = combineReducers({
  routing: routerReducer,
  auth: authReducer,
  record: recordReducer,
  permissions: permissionsReducer,
  search: searchReducer,
  selldata: selldataReducer,
  listings: listingsReducer,
  saleOrders: saleOrdersReducer,
  buyOrders: buyOrdersReducer,
});

export default reducer;
