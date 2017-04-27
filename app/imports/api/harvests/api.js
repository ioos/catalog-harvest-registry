// For advanced usage of Restivus by Nimble such as
// route permissions, checkout:
// https://github.com/kahmali/meteor-restivus/

import { Restivus } from 'meteor/nimble:restivus';
import { Harvests } from './harvests.js';
import { callHarvestAPI } from './methods.js';

if (Meteor.isServer) {

  let ApiV1 = new Restivus({
      version: 'v1',
      useDefaultAuth: true,
      prettyJson: (Meteor.isDevelopment) ? true : false
  });

  ApiV1.addCollection(Harvests, {
    excludedEndpoints: [
      "put",
      "post",
      "delete"
    ],
    routeOptions: {
      authRequired: false
    }
  });

  let ApiV2 = new Restivus({
    version: 'v2',
    useDefaultAuth: true,
    prettyJson: (Meteor.isDevelopment) ? true : false
  });

  ApiV2.addRoute('harvests/:id/harvest', {
    authRequired: true
  },{
    get() {
      let user = Meteor.users.findOne({_id: this.request.headers['x-user-id']});
      let harvest = Harvests.findOne({_id: this.urlParams.id});
      let isAdmin = Roles.userIsInRole(user._id, ["admin"]);
      if(!harvest) {
        return {
          statusCode: 404,
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: {status: "Not Found"}
        };
      }
      if(!isAdmin && (!user || !_.contains(user.profile.organization, harvest.organization))) {
        return {
          statusCode: 401,
          headers: {
            "Content-Type": "application/json;charset=utf-8"
          },
          body: {status: "Unauthorized"}
        };
      }
      let response = callHarvestAPI(this.urlParams.id);
      return {"status": "harvesting"};
    }
  });


}

// Representational State (REST) endpoints disabled by default.
// Uncommenting below will expose ALL routes for Harvests
//
// Please review restivus documentation on how to harden endpoints.
//
// USE WITH CAUTION... can you imagine - $ maka g:api BankRecords
//ApiV1.addCollection(Harvests);
