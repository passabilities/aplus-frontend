import React, { Component } from 'react';
import GetListingsContainer from '../../ui/getlistings/GetListingsContainer';

class GetListings extends Component {
  render () {
    return (
      <main className='container'>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            <h1>Get Listing</h1>
            <GetListingsContainer />
          </div>
        </div>
      </main>
    );
  }
}

export default GetListings;
