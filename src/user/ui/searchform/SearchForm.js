import React, { Component } from 'react';

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
    const listings = this.props.listings

    const searchForm = () =>
      <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
        <fieldset>
          <label htmlFor='property'>University or Course name</label>
          <input id='property' type='text' value={this.state.property} onChange={this.onInputChange('property')} placeholder='University or Course name' />

          <br />

          <button type='submit' className='pure-button pure-button-primary'>Search</button>
        </fieldset>
      </form>;

    const buyButton = (dataHash, price) =>
      <button className='pure-button pure-button-primary' onClick={this.buy(dataHash, price)} >Buy</button>
    
    const searchResults = (records) =>
      records.map(record => {
        try{
          const metadata = JSON.parse(record.metadata.replace(", }", "}"))
          let price = 0

          listings.forEach( (listing) => {
            if(listing.dataHash == record.dataHash){
              price = (listing.price/1000000000000000000)
            }
          });

          if(price != 0){
            return (
              <div key={record.dataHash}>
                <h2>University: {metadata["university"]}</h2>
                <h3>Course Name: {metadata["course-name"]}</h3>
                <p className='price'>Price: {price} eth</p>
                {buyButton(record.dataHash, price)}
                <p>Preview: {metadata["preview"]}</p>
                <p>Owner: {record.owner}</p>
                <br />
              </div>);
          }
        } catch(e) {
          return(<p />);
        }

      });

    if (this.props.search.results) {
      var res = JSON.parse(this.props.search.results);
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

export default SearchForm;
