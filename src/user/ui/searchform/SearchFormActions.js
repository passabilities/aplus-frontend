var request = require('request');

export const MAKE_SEARCH = 'MAKE_SEARCH';
function assignSearch (search) {
  return {
    type: MAKE_SEARCH,
    payload: search,
  };
}

export function search (property) {
  // Get Record from Linnia
  return async function (dispatch) {
    let req = process.env.LINNIA_SEARCH_URI + '/records';
    if (property) {
      req = req + '?property=' + property;
    }

    request(req, (error, response, body) => {
      if (error) {
        console.error(error.stack);
      }
      dispatch(assignSearch(body));
    });
  };
}
