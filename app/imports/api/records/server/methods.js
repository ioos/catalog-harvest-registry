/*
 * Meteor methods for Records collection
 */

import { Meteor } from 'meteor/meteor';
import { Records } from '../records.js';
import { check } from 'meteor/check';

Meteor.methods({
  'records.errorCount'({harvestId}) {
    check(harvestId, String);
    let errorCount = 0;
    Records.find({
      harvest_id: harvestId, 
      validation_errors: {$exists: true, $ne: []}
    }, {validation_errors: 1}).forEach((record)=> {
      errorCount += record.validation_errors.length;
    });
    return errorCount;
  },
  'records.servicesCount'({harvestId}) {
    let count = 0;
    check(harvestId, String);
    Records.find({
      harvest_id: harvestId,
      services: {$exists: true, $ne: []}
    }, {services: 1}).forEach(function(record) {
      count += record.services.length;
    });
    return count;
  },
  'records.count'({harvestId}) {
    check(harvestId, String);
    return Records.find({harvest_id: harvestId}).count();
  }
});
