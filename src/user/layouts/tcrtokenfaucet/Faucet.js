import React, { Component } from 'react';

class Faucet extends Component {
  constructor (props) {
    super(props);

    this.state = {
      address: '',
      privateKey: '',
      address:'',
    };

    // Set variables pass as url arguments
    window.location.search.substr(1).split('&').forEach((param) => {
      const key = param.split('=')[0];
      const val = param.split('=')[1];
      if (key === 'address') {
        this.state['address'] = val;
      }
    });
  }

  onInputChange = (property) => (event) => {
    const value = event.target.value;
    this.setState({ [property]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const address = event.target.elements.address.value;

    if (address.length < 2) {
      return alert('Please fill the address');
    }

    // fix it?
    this.props.onGetRecordSubmit(address);
  }


  render () {
      return (
        <div>
          {/* fix css at some point */}
          <br />
          <br />
          <br />
          <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
            <fieldset>
              <br />
              <label htmlFor='address'>Address</label>
              {/* fix with address */}
              <input id='Address' type='text' value={this.state.address} onChange={this.onInputChange('address')} placeholder='Address' />

              <span className='pure-form-message'>This is a required field.</span>

              <br />

              <button type='submit' className='pure-button pure-button-primary'>Claim TCR Token</button>
            </fieldset>
          </form>
        </div>
      );
  }
}

export default Faucet;
