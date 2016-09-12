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
import { ValidatedMethod, ValidationError } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { Roles } from 'meteor/alanning:roles';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import { Organizations } from './organizations.js';
import { Harvests } from '../harvests/harvests.js';

export const insert = new ValidatedMethod({
  name: 'organizations.insert',
  validate: Organizations.schema.validator(),
  run(doc) {

    let currentUserId = Meteor.userId();
    if(!Roles.userIsInRole(currentUserId, "admin")) {
      throw new Meteor.Error(401, "Unauthorized");
    }

    return Organizations.insert(
      doc
    );
  }
});

export const update = new ValidatedMethod({
  name: 'organizations.update',
  validate({_id, modifier}){
    Organizations.schema.validator()(modifier.$set);
  },
  run({_id, modifier}) {
    let currentUserId = Meteor.userId();
    if(!Roles.userIsInRole(currentUserId, "admin")) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    let organization = Organizations.findOne({_id});
    if(_.isUndefined(organization)) {
      throw new Meteor.Error(404, "Not Found");
    }
    Organizations.update({_id}, modifier);
    if(_.has(modifier, "$set") && _.has(modifier.$set, "name")) {
      let nameUpdate = modifier.$set.name;
      Harvests.update({organization: organization.name}, {$set: {organization: nameUpdate}});
    }
  }
});

export const remove = new ValidatedMethod({
  name: 'organizations.remove',
  validate: null,
  run(organizationId) {
    let currentUserId = Meteor.userId();
    if(!Roles.userIsInRole(currentUserId, "admin")) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    Organizations.remove({_id: organizationId});
  }
});

const RATE_LIMITED_METHODS = _.pluck([
  insert,
  update,
  remove
], 'name');

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
