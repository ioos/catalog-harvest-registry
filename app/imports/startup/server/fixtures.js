import { Meteor } from 'meteor/meteor';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Accounts } from 'meteor/accounts-base';
// if the database is empty on server start, create some sample data.
Meteor.startup(function() {
  if (Harvests.find().count() === 0) {
    Harvests.insert({ name: 'test',
                      url: 'http://frobnicatorzzz.com',
                      org: 'foobaz',
                      harvest_interval: 2 * 3600,
                      harvest_type: 'WAF'});
  } 

  if(Meteor.users.find().count() === 0) {
    Accounts.createUser({
      username: "test@ioos.us",
      email: "test@ioos.us",
      password: "testadmin",
      profile:{
        name: "Test User"
      }
    });
  }
});
