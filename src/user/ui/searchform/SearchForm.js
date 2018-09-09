import React, { Component } from 'react';
var showdown  = require('showdown');

class SearchForm extends Component {
  constructor (props) {
    super(props);

    this.state = {
      property: '',
    };

    // Set variables pass as url arguments
    window.location.search.substr(1).split('&').forEach((param) => {
      const key = param.split('=')[0];
      const val = param.split('=')[1];
      if (this.state[key] !== undefined) {
        this.state[key] = val;
      }
    });
  }

  onInputChange = (property) => (event) => {
    const value = event.target.value;
    this.setState({ [property]: value });
  }

  buy = (dataHash, price) => (event) => {
    this.props.onBuy(dataHash, price);
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const property = event.target.elements.property.value;
    this.props.onSearchSubmit(property);
  }

  render () {
    const { listings, escrow } = this.props;

    const searchForm = () =>
      <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
        <fieldset>
          <label htmlFor='property'>University or Course name</label>
          <input id='property' type='text' value={this.state.property} onChange={this.onInputChange('property')} placeholder='University or Course name' />

          <br />

          <button type='submit' className='pure-button pure-button-primary'>Search</button>
          <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px', padding: '5px', borderStyle: "solid"}}>
            <div style={{display:"inline", margin:"10px"}}><i className="fas fa-check-circle fa-2x" style={{color:"green"}}></i> A verified Expert from the a+plus Expert List has attested to the quality of these notes. </div>
            <div style={{display:"inline", margin:"10px"}}><i className="fas fa-circle fa-2x" style={{color:"green"}}></i> A Non-expert has attested to the quality of these notes.</div>
          </div>
        </fieldset>
      </form>;

    const buyButton = (dataHash, price) =>
      <button className='pure-button pure-button-primary' onClick={this.buy(dataHash, price)} >Buy</button>;

    const checks = ({ sigCount, tcrCount }) => {
      const tcrStartIndex = sigCount - tcrCount
      const arr = []

      for (let i = 0; i < sigCount; i++) {
        const faClass = i < tcrStartIndex ? 'fa-circle' : 'fa-check-circle'
        arr.push(
          <i key={`attestor-${i}`} className={`fas ${faClass} fa-8x fright`} style={{color:"green"}}></i>
        )
      }

      return arr
    }

    const searchResults = (records) =>
      records.map((record) => {
        try{
          const metadata = JSON.parse(record.metadata.replace(", }", "}"));

          var converter = new showdown.Converter();
          var htmlMetadata  = converter.makeHtml(metadata["preview"]);

          let price = 0;

          listings.forEach( (listing) => {
            if(listing.dataHash == record.dataHash){
              price = (listing.price/1000000000000000000);
            }
          });

        if(price != 0){
          return (
            <div className='frameit' key={record.dataHash}>
              {checks(record)}
              <h3 className='price'>ETH {price}</h3>
              <h2>University: {metadata["university"]}</h2>
              <h3>Course Name: {metadata["course-name"]}</h3>
              {buyButton(record.dataHash, price)}
              <div dangerouslySetInnerHTML={{ __html: htmlMetadata }}  />
              <p>Owner:
                <br />
                {record.owner}
              </p>
              <p>Datahash:
                <br />
                {record.dataHash}
              </p>
              <br />
            </div>);
          }
        } catch(e) {
        }

    });

    if (escrow) {
      var res = this.props.search.results;
      return (
        <div>
          <h2 className='price-congrats'>Congratulations, your offer is being processed!</h2>
          {searchForm()}
          {searchResults(res)}
        </div>
      );
    } else{
      if (this.props.search.results) {
        var res = this.props.search.results;
        if (res.constructor !== Array) {
          res = [res];
        }
        if (res.message) {
          return (
            <div>
              <p className='error-message'>{res.message}</p>
              {searchForm()}
            </div>
          );
        } else {
          return (
            <div>
              {searchForm()}
              {searchResults(res)}
            </div>
          );
        }
      } else {
        return (
          <div>
            {searchForm()}
          </div>
        );
      }
    }
  }
}

export default SearchForm;
