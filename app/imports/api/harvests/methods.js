/**
 * @module /imports/api/harvests/methods
 */

/* Methods are highly app specific and as such Maka doesn't try
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
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import { HTTP } from 'meteor/http';
import { Harvests } from './harvests.js';
import { Attempts } from '/imports/api/attempts/attempts.js';

import urljoin from 'url-join';

/**
 * Inserts a new Harvest.
 *
 * Example:
 * ```
 * Meteor.call("harvests.insert", harvest, (error, harvestId) => {
 *   ...
 * });
 * ```
 * @function insert
 * @param {object} harvest A Harvest object
 */
export const insert = new ValidatedMethod({
    name: 'harvests.insert',
    validate: Harvests.simpleSchema().pick(['name', 'organization', 'url', 'harvest_type', 'harvest_interval', 'publish']).validator({clean: true, filter: false}),
    run(harvest) {
      let userId = Meteor.userId();
      if(!userId) {
        throw new Meteor.Error(401, "Unauthorized");
      }
      return Harvests.insert(harvest);
    }
});


/**
 * Updates an existing Harvest.
 *
 * Example:
 * ```
 * Meteor.call("harvests.update", {_id: harvestId, modifier: {$set:  harvest}}, (error, harvestId) => {
 *    ...
 * });
 * ```
 *
 * @function update
 * @param {object} update The update object
 * @param {string} update._id The Harvest identifier
 * @param {object} update.modifier The MongoDB update object
 */
export const update = new ValidatedMethod({
    name: 'harvests.update',
    validate({_id, modifier}){
      Harvests.schema.pick(["name", "url", "harvest_interval", "harvest_type", "organization", "publish"]).validator()(modifier.$set);
    },
    run({_id, modifier}) {
      let user = Meteor.user();
      let originalHarvest = Harvests.findOne({_id: _id});
      // Check if the harvest actually exists
      if(!originalHarvest) {
        throw new Meteor.Error(404, "Not Found");
      }
      // Let admins do whatever they want
      if(Roles.userIsInRole(user._id, ["admin"])) {
        return Harvests.update({_id}, modifier);
      }
      // Only users of the same organization can update that organization's
      // harvests
      if(!user || !_.contains(user.profile.organization, originalHarvest.organization)) {
        throw new Meteor.Error(401, "Unauthorized");
      }
      return Harvests.update({_id}, modifier);
    }
});


/**
 * Removes a Harvest.
 *
 * Example:
 * ```
 * Meteor.call("harvests.remove", harvestId, (error, harvestId) => {
 *    ...
 * });
 * ```
 *
 * @function remove
 * @param {string} harvestId The Harvest identifier
 */
export const remove = new ValidatedMethod({
  name: 'harvests.remove',
  validate: null,
  run(harvestId) {
      let user = Meteor.user();
      let originalHarvest = Harvests.findOne({_id: harvestId});
      let isAdmin = Roles.userIsInRole(user._id, ["admin"]);
      if(!originalHarvest) {
        throw new Meteor.Error(404, "Not Found");
      }
      if(!isAdmin && (!user || !_.contains(user.profile.organization, originalHarvest.organization))) {
        throw new Meteor.Error(401, "Unauthorized");
      }

      Attempts.remove({parent_harvest: harvestId});
      return Harvests.remove({_id: harvestId});
  }
});


/**
 * Queues a job for this Harvest
 *
 * Example:
 * ```
 * Meteor.call("harvests.activate", harvestId, (error, harvestId) => {
 *    ...
 * });
 * ```
 *
 * @function activate
 * @param {string} harvestId The Harvest identifier
 */
export const activate = new ValidatedMethod({
  name: 'harvests.activate',
  validate: null,
  run(harvestId) {
      let user = Meteor.user();
      let originalHarvest = Harvests.findOne({_id: harvestId});
      let isAdmin = Roles.userIsInRole(user._id, ["admin"]);
      if(!originalHarvest) {
        throw new Meteor.Error(404, "Not Found");
      }
      if(!isAdmin && (!user || !_.contains(user.profile.organization, originalHarvest.organization))) {
        throw new Meteor.Error(401, "Unauthorized");
      }

      if(!Meteor.settings.services || !Meteor.settings.services.harvestAPI) {
        throw new Meteor.Error(500, "Harvest API Not Defined");
      }

      let apiURL = urljoin(Meteor.settings.services.harvestAPI, harvestId);

      let response = Meteor.wrapAsync((apiURL, callback) => {
        let errorCode;
        let errorMessage;
        let myError;
        try {
          let response = HTTP.get(apiURL);
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
  }
});


/**
 * Returns the number of Harvests in the collection
 *
 * Example:
 * ```
 * Meteor.call("harvests.count", (error, harvestCount) => {
 *    ...
 * });
 * ```
 *
 * @function count
 */
Meteor.methods({
  'harvests.count'() {
    return Harvests.find({}).count();
  }
});

Meteor.methods({
  'harvests.total_datasets'() {
    let count = Harvests.aggregate([{$group: { _id: null, sum: { $sum: "$last_record_count" } }} ]);
    return count[0].sum;
  }
});

/*
const RATE_LIMITED_METHODS = _.pluck([insert, update], 'name');
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
