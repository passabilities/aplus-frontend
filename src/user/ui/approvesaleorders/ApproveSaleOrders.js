import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

class ApproveSaleOrders extends Component {
	state = {
		privateKey: '',
	};

	componentDidMount() {
		this.props.getOpenSaleOrders();
	}

	onChange = (event) => {
		const privateKey = event.target.value;
		this.setState({ privateKey });
	}

	render() {
		const { saleOrders, fulfillSaleOrder, error, step } = this.props;
    const { privateKey } = this.state;

		return (
  <div>
    <div style={{width: '60%'}} >
      {step && <div>
        {step}
        <LinearProgress />
        <br />
        <br />
      </div>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!!saleOrders.filter(saleOrder => !saleOrder.fulfilled).length && <div>
        <p>** Disclaimer: We need your private key to decrypt the data to share. **</p>
        <label style={{ fontSize: 20}}>
  						Private Key
          <span />
          <input
            type='password'
            value={privateKey}
            onChange={this.onChange}
  						/>
        </label>
      </div>}
      <br />
      {saleOrders.filter(saleOrder => !saleOrder.fulfilled).map((saleOrder, i) => (
        <div key={i} className='frameit'>
          <br />
          <p>Buyer:
            <br />
            {saleOrder.buyer}
          </p>
          <p>DataHash:
            <br />
            {saleOrder.dataHash}</p>
          <button
            onClick={() => fulfillSaleOrder(
  								saleOrder.dataHash,
  								saleOrder.buyer,
  								saleOrder.buyerPublicKey,
  								privateKey,
  								saleOrder
  							)}
            className='pure-button pure-button-primary'
  						>Approve</button>
        </div>
  				))}
      {!saleOrders.filter(saleOrder => !saleOrder.fulfilled).length && <h2>No sale orders. Get out there and sell yourself!</h2>}
    </div>
  </div>
		);
	}
}

export default ApproveSaleOrders;
