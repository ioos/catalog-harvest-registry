import { Meteor } from 'meteor/meteor';
import { Harvests } from '../harvests.js';

Meteor.publish('harvests', function() {
  return Harvests.find();
});
