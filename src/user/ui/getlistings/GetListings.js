import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

class GetListings extends Component {
	state = {}

	componentDidMount() {
		this.props.getListings();
	}

	updatePublicKey = (dataHash) => (event) => {
		const newPublicKey = event.target.value;
		this.setState({ [dataHash]: newPublicKey });
	}

	render() {
		const { listings, buyListing, step } = this.props;

		return (
  <div style={{width: '60%'}}>
    {step && <div>
      {step}
      <LinearProgress />
      <br />
    </div>}
    {listings.map((listing, i) => {
					const canBuy = !listing.escrow;
					const publicKey = this.state[listing.dataHash] || '';
					const buttonTitle = canBuy ? 'Buy' : listing.escrow.fulfilled ? 'Bought' : "Pending";

					return (
  <div key={i}>
    <h3>DataHash: {listing.dataHash}</h3>
    <p>Owner Address: {listing.owner}</p>
    <p>Price: {listing.price}</p>
    {canBuy && <label>
								Public Key:
      <span />
      <input 
        type='text' 
        value={publicKey}
        onChange={this.updatePublicKey(listing.dataHash)}
								/>
    </label>}
    {canBuy && <div style={{ height: 10}} />}
    <div>
      <button 
        className='pure-button pure-button-primary'
        disabled={!canBuy}
        onClick={() => canBuy && buyListing(listing, publicKey)}
								>{buttonTitle}</button>
    </div>
  </div>
					);
				})}
  </div>
		);
	}
}

export default GetListings;