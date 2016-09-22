// For advanced usage of Restivus by Nimble such as
// route permissions, checkout:
// https://github.com/kahmali/meteor-restivus/

import { Restivus } from 'meteor/nimble:restivus';

import { Harvests } from './harvests.js';

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

}

// Representational State (REST) endpoints disabled by default.
// Uncommenting below will expose ALL routes for Harvests
//
// Please review restivus documentation on how to harden endpoints.
//
// USE WITH CAUTION... can you imagine - $ maka g:api BankRecords
//ApiV1.addCollection(Harvests);
