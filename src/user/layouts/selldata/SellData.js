import React, { Component } from 'react';
import SellDataContainer from '../../ui/selldata/SellDataContainer';

class SellData extends Component {
  render () {
    return (
      <main className='container'>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            <h1>Sell Data</h1>
            <SellDataContainer />
          </div>
        </div>
      </main>
    );
  }
}

export default SellData;
