import React, { Component } from 'react';

class BuyingEscrows extends Component {
	state = {}

	componentDidMount() {
		this.props.getOpenBuyingOrders();
	}

	render() {
		const { buyOrders } = this.props;
		return (
  <div>
    {buyOrders.map((buyOrder, i) => {
				var buttonText = "Pending";
				var dataHash = buyOrder[5];
				if(buyOrder[3]){
					buttonText = "Completed";
					dataHash = buyOrder[5];
				}
				return(
  <div key={i}>
    <p>Owner Address: {buyOrder[1]}</p>
    <p>DataHash: {dataHash}</p>
    <div>
      <button 
        className='pure-button pure-button-primary'
        disabled
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
