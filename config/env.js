// Grab NODE_ENV and REACT_APP_* environment variables and prepare them to be
// injected into the application via DefinePlugin in Webpack configuration.

var REACT_APP = /^REACT_APP_/i;
require('dotenv').load()

function getClientEnvironment(publicUrl) {
  var processEnv = Object
    .keys(process.env)
    .filter(key => REACT_APP.test(key))
    .reduce((env, key) => {
      env[key] = JSON.stringify(process.env[key]);
      return env;
    }, {
      // Useful for determining whether we’re running in production mode.
      // Most importantly, it switches React into the correct mode.
      'NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      // Useful for resolving the correct path to static assets in `public`.
      // For example, <img src={process.env.PUBLIC_URL + '/img/logo.png'} />.
      // This should only be used as an escape hatch. Normally you would put
      // images into the `src` and `import` them in code to get their paths.
      'PUBLIC_URL': JSON.stringify(publicUrl),

      // Other Env variables
      'LINNIA_ETH_PROVIDER': JSON.stringify("https://ropsten.infura.io/l9GJbPZHjmcuNncqAniu"),
      'LINNIA_IPFS_HOST': JSON.stringify("ipfs.infura.io"),
      'LINNIA_IPFS_PORT': JSON.stringify("5001"),
      'LINNIA_IPFS_PROTOCOL': JSON.stringify("https"),
      'LINNIA_HUB_ADDRESS': JSON.stringify("0x177bf15e7e703f4980b7ef75a58dc4198f0f1172"),
      'LINNIA_SEARCH_URI': JSON.stringify("https://linniaserver.com")
    });
  return {'process.env': processEnv};
}

module.exports = getClientEnvironment;
