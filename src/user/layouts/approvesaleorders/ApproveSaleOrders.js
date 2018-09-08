import React, { Component } from 'react'
import ApproveSaleOrdersContainer from '../../ui/approvesaleorders/ApproveSaleOrdersContainer'

class ApproveSaleOrders extends Component {
  render () {
    return (
      <main className='container'>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            <h1>Open Sale Orders</h1>
            <ApproveSaleOrdersContainer />
          </div>
        </div>
      </main>
    )
  }
}

export default ApproveSaleOrders;
