import React, { Component } from 'react';

class BuyingEscrows extends Component {
	state = {}

	componentDidMount() {
		this.props.getOpenBuyingOrders();
	}

	render() {
		const { buyOrders, revokeOrder } = this.props;
		return (
  <div>
    {buyOrders.map((buyOrder, i) => {
				var buttonText = "Processing";
				var dataHash = buyOrder[5];
				if(buyOrder[4]){
					buttonText = "Closed";
					dataHash = buyOrder[5];
				}
				return(
  <div key={i}>
    <p>Owner Address: {buyOrder[1]}</p>
    <p>DataHash: {dataHash}</p>
    <div>
      <button 
        className='pure-button pure-button-primary'
        disabled={true}
							>{buttonText}</button>
    </div>
  </div>	
				);		
			})}
  </div>
		);
	}
}

export default BuyingEscrows;