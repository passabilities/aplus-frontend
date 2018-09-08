import React, { Component } from 'react'
import BuyingEscrowsContainer from '../../ui/buyingEscrows/BuyingEscrowsContainer'

class BuyingEscrows extends Component {
  render () {
    return (
      <main className='container'>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            <h1>Open Buying Orders</h1>
            <BuyingEscrowsContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default BuyingEscrows
