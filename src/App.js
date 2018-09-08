import React, { Component } from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

// Styles
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

// Layouts
import Home from './layouts/home/Home';
import Search from './user/layouts/search/Search';
import Header from './layouts/header/Header';
import SellData from './user/layouts/selldata/SellData';
import GetListings from './user/layouts/getlistings/GetListings';
import ApproveSaleOrders from './user/layouts/approvesaleorders/ApproveSaleOrders';
import BuyingEscrows from './user/layouts/buyingEscrows/BuyingEscrows';
import GetRecord from './user/layouts/getrecord/GetRecord';

import ProtectedRoute from './ProtectedRoute';

const history = createHistory({
  basename: '',
});

class App extends Component {
  componentDidMount () {
    this.props.authenticate();
  }

  render () {
    const { isAuthenticated, authError } = this.props;

    return (
      <div className='App'>
        <Header history={history} />
        <Router history={history}>
          <Switch>
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/list-data'
              authError={authError}
              component={SellData}
            />
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/for-sale'
              authError={authError}
              component={GetListings}
            />
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/approve-sale-orders'
              authError={authError}
              component={ApproveSaleOrders}
            />
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/buying-orders'
              authError={authError}
              component={BuyingEscrows}
            />
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/get-data'
              authError={authError}
              component={GetRecord}
            />
            <ProtectedRoute
              isAuthenticated={isAuthenticated}
              path='/'
              authError={authError}
              component={Search}
            />
            />
            <Route
              exact
              path='*'
              render={() => <Home authError={authError} />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
