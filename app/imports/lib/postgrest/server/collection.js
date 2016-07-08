import { RestCollection } from '../collection.js';
import { Meteor } from 'meteor/meteor';
import querystring from 'querystring';
import urljoin from 'url-join';

RestCollection.prototype.register = function() {
  var self = this;
  let methods = {};
  methods[this._collectionName + ".read"] = function(docId) {
    // On the server, this will allow the N+1th invocation of this method to
    // run in a new fiber. This allows the proxying to be asynchronous.
    this.unblock(); // this points to Meteor

    let apiURL = urljoin(self._api, self._tableName);

    // If this is fetching a single document.
    if(docId) {
      apiURL += "?" + querystring.stringify({id: "eq." + docId});
    }

    let response = Meteor.wrapAsync((apiURL, callback) => {
      let errorCode;
      let errorMessage;
      let myError;
      try {

        // Get the data and call the callback with the response;
        let response = HTTP.get(apiURL).data;
        callback(null, response);
      } catch (error) {
        if(error.response) {
          errorCode = error.response.data.code;
          errorMessage = error.response.data.message;
        } else {
          errorCode = 500;
          errorMessage = "Cannot Access API";
        }
        myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);

      }
    })(apiURL);
    return response;
  };
  Meteor.methods(methods);
};
