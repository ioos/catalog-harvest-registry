/**
 * Methods are highly app specific and as such Maka doesn't try
 * to implement any logic out of the box.  This file is simply to
 * provide a friendly reminder that you MAY need to have Methods.
 *
 * Also, it's a good idea to note that you may want to rate limit
 * your methods.
 *
 * Reference meteor's Todos app for more examples
 *
 * https://github.com/meteor/todos/blob/master/imports/api/lists/methods.js
 *
 * You'll need to install ValidatedMethod and SimpleSchema
 *
 * $ maka add mdg:validated-method aldeed:simple-schema
 */




import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';

import { Harvests } from './harvests.js';

export const insert = new ValidatedMethod({
    name: 'harvests.insert',
    validate: Harvests.simpleSchema().pick(['name', 'organization', 'url', 'harvest_type', 'harvest_interval']).validator({clean: true, filter: false}),
    run(harvest) {
      console.log(harvest);
      return Harvests.insert(harvest);
    }
});


export const update = new ValidatedMethod({
    name: 'harvests.update',
    validate: Harvests.schema.pick([
      '_id',
      'name',
      'org',
      'url',
      'harvest_type',
      'harvest_interval'
    ]).validator({clean: true, filter: false}),
    run({_id,
         name,
         org,
         url,
         harvest_type,
         harvest_interval}) {
      
      let updateDoc = {
        $set: {
          name,
          org,
          url,
          harvest_type,
          harvest_interval
        }
      };

      return Harvests.update(_id, updateDoc);
    }
});

/*
 const RATE_LIMITED_METHODS = _.pluck([
     insert
 ], 'name');
 */
/*
 if (Meteor.isServer) {
        // Only allow 5 list operations per connection per second.
        DDPRateLimiter.addRule({
            name(name) {
                return _.contains(RATE_LIMITED_METHODS, name);
            },

            // Rate limit per connection ID.
            connectionId() { return true; },
        }, 5, 1000);
    }

*/
