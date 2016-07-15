// For advanced usage of Restivus by Nimble such as
// route permissions, checkout:
// https://github.com/kahmali/meteor-restivus/

import { Restivus } from 'meteor/nimble:restivus';

import { Organizations } from './organizations.js';

let ApiV1 = new Restivus({
    version: 'v1',
    useDefaultAuth: true,
    prettyJson: (Meteor.isDevelopment) ? true : false
});

// Representational State (REST) endpoints disabled by default.
// Uncommenting below will expose ALL routes for Organizations
//
// Please review restivus documentation on how to harden endpoints.
//
// USE WITH CAUTION... can you imagine - $ maka g:api BankRecords
//ApiV1.addCollection(Organizations);
