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

  handleSubmit = (event) => {
    event.preventDefault();
    const property = event.target.elements.property.value;
    this.props.onSearchSubmit(property);
  }

  render () {
    const searchForm = () =>
      <form className='pure-form pure-form-stacked' onSubmit={this.handleSubmit}>
        <fieldset>
          <label htmlFor='property'>University or Course name</label>
          <input id='property' type='text' value={this.state.property} onChange={this.onInputChange('property')} placeholder='University or Course name' />

          <br />

          <button type='submit' className='pure-button pure-button-primary'>Search</button>
        </fieldset>
      </form>;

    const searchResults = (records) =>
      records.map(record => {
        console.log(record.metadata);
        try{
          const metadata = JSON.parse(record.metadata.replace(", }", "}"));
          console.log(typeof metadata);
          return (
            <div key={record.dataHash}>
              <h2>University: {metadata["university"]}</h2>
              <h3>Course Name: {metadata["course-name"]}</h3>
              <p>Preview: {metadata["preview"]}</p>
              <p>Owner: {record.owner}</p>

              <br />
            </div>);
        } catch(e) {
          console.log(e);
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
