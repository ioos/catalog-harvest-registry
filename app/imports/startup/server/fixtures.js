import { Meteor } from 'meteor/meteor';
import { Harvests } from '/imports/api/harvests/harvests.js';
// if the database is empty on server start, create some sample data.
console.log("Fixtures imported");
Meteor.startup(function() {
  console.log("Meteor startup called");
  // can't use Harvests.count()??
  if (Harvests.find().count() === 0) {
    Harvests.insert({ name: 'test',
                      url: 'http://frobnicatorzzz.com',
                      org: 'foobaz',
                      harvest_interval: 2 * 3600,
                      harvest_type: 'WAF'});
    console.log('Wrote a test harvest record');
  } 
});
