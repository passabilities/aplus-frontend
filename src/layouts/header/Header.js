import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Header extends Component {
  navigateTo = route => () => {
    this.props.history.push(route);
  };

  render () {
    return (
      <nav className='navbar pure-menu pure-menu-horizontal'>
        <ul className='pure-menu-list navbar-right'>
          <span>
            <li className='pure-menu-item'>
              <span
                className='pure-menu-link'
                onClick={this.navigateTo('/approve-sale-orders')}
              >
                Approve Note Sales
              </span>
            </li>
            <li className='pure-menu-item'>
              <span
                className='pure-menu-link'
                onClick={this.navigateTo('/buying-orders')}
              >
                Purchase History
              </span>
            </li>
            <li className='pure-menu-item'>
              <span
                className='pure-menu-link'
                onClick={this.navigateTo('/get-data')}
              >
                Get Notes
              </span>
            </li>
          </span>
        </ul>
        <span
          onClick={this.navigateTo('/')}
          className='pure-menu-heading pure-menu-link logo-container'
        >
          a<span className='plus-sign-logo'>+</span>plus
        </span>
      </nav>
    );
  }
}

Header.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Header;
