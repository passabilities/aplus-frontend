import React, { Component } from "react";
import PropTypes from "prop-types";
import AuthError from "./../../auth/authError/AuthError";

const Copy = () => {
  return (
    <div>
      <h1>Welcome to the Linnia Decentralized Data Exchange!</h1>
      <p>
        You can buy and sell personal data here, with the piece of mind of
        knowing that nobody else can tamper with it.
      </p>
      <p>Start monitizing your information.</p>
      <img
        src={require("./linnia.png")}
        style={{
          width: 600,
          height: 600,
        }}
      />
    </div>
  );
};

class Home extends Component {
  render() {
    const { authError } = this.props;

    return (
      <main className='container'>
        <div className='pure-g'>
          <div className='pure-u-1-1'>
            {authError ? <AuthError authError={authError} /> : <Copy />}
          </div>
        </div>
      </main>
    );
  }
}

Home.propTypes = {
  authError: PropTypes.string,
};

export default Home;
