import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

class SellData extends Component {
    constructor (props) {
        super(props)
        this.state = {
            price: ''
        }
      }

    componentDidMount() {
        this.props.getSellData()
    }

    onInputChange = (property) => (event) => {
        const value = event.target.value
        this.setState({ [property]: value })
    }

    render(){    
          const handleSubmit = (data) => {
            const price = this.state.price
        
            if (! price) {
              return alert('Please fill the price')
            }
        
            this.props.createListing(data, price)
        }

        const { step, sellData } = this.props;
        
        return (
            <div style={{width: '60%'}}>
                {step && <div>
                    {step}
                    <LinearProgress />
                    <br />
                </div>}
                {sellData.map((data, i) => {
                    return (
                        <div key={i}>
                            <p>DataHash: {data.dataHash}</p>
                            <p>MetaData: {data.metadata}</p>
                            <p>Iris Score: {data.irisScore}</p>
                            <input id='price' value={this.state.price} onChange={this.onInputChange('price')} placeholder='Price' />
                            <div>
                                <button 
                                        className='pure-button pure-button-primary'
                                        onClick={() => handleSubmit(data)}
                                >Sell</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default SellData