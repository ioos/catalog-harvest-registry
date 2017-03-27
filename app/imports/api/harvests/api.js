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

  let ApiV2 = new Restivus({
    version: 'v2',
    useDefaultAuth: true,
    prettyJson: (Meteor.isDevelopment) ? true : false
  });

  ApiV2.addRoute('harvests/:id/harvest', {
    authRequired: true
  },{
    get() {
      console.log(this.urlParams.id);
      return {"test":"success"};
    }
  });
  /*
   * To Authenticate
   * curl -i -d 'email=lcampbell@ioos.us&password=da7655b5bf67039c3e76a99d8e6fb6969370bbc0fa440cae699cf1a3e2f1e0a1&hashed=true' -XPOST localhost:3000/api/v2/login
   */

  /*
   * To execute:
   * curl -H "X-Auth-Token: 11RNttydywkBJj5Qwj-PiREawMRr0wQkmPvu6fHPbVF" -H "X-User-Id: urgkbrjoussWi55M2" -i localhost:3000/api/v2/harvests/abc123/harvest
   */



}

// Representational State (REST) endpoints disabled by default.
// Uncommenting below will expose ALL routes for Harvests
//
// Please review restivus documentation on how to harden endpoints.
//
// USE WITH CAUTION... can you imagine - $ maka g:api BankRecords
//ApiV1.addCollection(Harvests);
