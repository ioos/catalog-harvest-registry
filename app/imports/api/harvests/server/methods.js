import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import querystring from 'querystring';

Meteor.methods({
  'harvests.read'(doc_id) {
    // On the server, this will allow the N+1th invocation of this method to
    // run in a new fiber. This allows the proxying to be asynchronous.
    this.unblock();
    let apiURL = 'http://localhost:3100/harvest_summary';
    if(doc_id) {
      apiURL += "?" + querystring.stringify({id: "eq." + doc_id});
    }
    // For the client this is a stub and shouldn't return anything. The server
    // will execute and replace the client's return value once it executes.
    let response = Meteor.wrapAsync((apiURL, callback) => {
      let errorCode;
      let errorMessage;
      let myError;
      try {

        // Get the data and call the callback with the response
        let response = HTTP.get(apiURL).data;
        callback(null, response);

      } catch (error) {
        //
        // Catch the errors and call the callback with the error
        if (error.response) {

          errorCode = error.response.data.code;
          errorMessage = error.response.data.message;

        } else {

          errorCode = 500;
          errorMessage = "Cannot access API";
          
        }
        myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
      }
    })(apiURL);
    return response;
  }
});
