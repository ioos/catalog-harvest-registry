import { Meteor } from 'meteor/meteor';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';
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
      username: "admin",
      email: "admin@ioos.us",
      password: "testadmin",
      profile:{
        name: "Admin",
        email: "admin@ioos.us"
      }
    });
    Roles.addUsersToRoles(Accounts.findUserByEmail('admin@ioos.us'), ['admin', 'approved']);
    Accounts.createUser({
      username: "lcampbell",
      email: "lcampbell@ioos.us",
      password: "bobpass",
      profile:{
        name: "Luke Campbell",
        email: "lcampbell@ioos.us"
      }
    });
    Roles.addUsersToRoles(Accounts.findUserByEmail('lcampbell@ioos.us'), ['approved']);
    Accounts.createUser({
      username: "badams",
      email: "badams@ioos.us",
      password: "bobpass",
      profile:{
        name: "Ben Adams",
        email: "badams@ioos.us"
      }
    });
  }
});
