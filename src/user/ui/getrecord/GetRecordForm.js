import React, { Component } from 'react';

class GetRecordForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      dataHash: '',
      privateKey: '',
    };

    // Set variables pass as url arguments
    window.location.search.substr(1).split('&').forEach((param) => {
      const key = param.split('=')[0];
      const val = param.split('=')[1];
      if (key === 'dataHash') {
        this.state['dataHash'] = val;
      }
    });
  }

  onInputChange = (property) => (event) => {
    const value = event.target.value;
    this.setState({ [property]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const dataHash = event.target.elements.dataHash.value;

    if (dataHash.length < 2) {
      return alert('Please fill the data hash.');
    }

    this.props.onGetRecordSubmit(dataHash);
  }

  handleDecrypt = (event) => {
    event.preventDefault();
    const privateKey = event.target.elements.privateKey.value;

    if (privateKey.length < 2) {
      return alert('Please fill the Private Key.');
    }

    this.props.onGetRecordDecrypt(this.props.record.data, privateKey);
  }

  render () {
    const comp1 = () =>
      <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
        <fieldset>
          <label htmlFor='dataHash'>Data Hash</label>
          <input id='dataHash' type='text' value={this.state.dataHash} onChange={this.onInputChange('dataHash')} placeholder='Data Hash' />
          <span className='pure-form-message'>This is a required field.</span>

          <br />

          <button type='submit' className='pure-button pure-button-primary'>Get Notes</button>
        </fieldset>
      </form>;

    // Got Results
    if (this.props.record.data) {
      // To decrypt
      if (this.props.record.data.decrypted) {
        return (
          <div>
            {comp1()}
            <form className='pure-form pure-form-stacked' onSubmit={this.handleDecrypt}>
              <fieldset>
                <label htmlFor='privateKey'>Private Key</label>
                <input id='privateKey' type='password' value={this.state.privateKey} onChange={this.onInputChange('privateKey')} placeholder='Private Key' />
                <span className='pure-form-message'>This is a required field.</span>

                <br />

                <button type='submit' className='pure-button pure-button-primary'>Decrypt Data</button>
              </fieldset>
            </form>
          </div>
        );
      } else { // Decrypted File
        return (
          <div>
            {comp1()}
            <div>
              <h2>Decryted Data</h2>
              <p>{this.props.record.data.decrypted}</p>
            </div>

            {/* decrypted data */}

            <form className='pure-form pure-form-stacked' onSubmit={this.handleDecrypt}>
              <fieldset>
                <p className="claim-text">Enjoy your a+plus notes!</p>
                <p className="claim-text">Please accept these APLUS tokens. You can use them to challenge a+plus Experts if you disagree with their credibility.</p>
                <br />
                <button type='submit' className='pure-button pure-button-primary'>Claim your APLUS tokens!</button>
              </fieldset>
            </form>
          </div>
        );
      }
    } else { // New Search
      return (comp1());
    }
  }
}

export default GetRecordForm;
