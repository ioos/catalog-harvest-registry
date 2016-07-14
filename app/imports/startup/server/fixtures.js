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
        email: "admin@ioos.us",
        organization: "IOOS"
      }
    });
    Roles.addUsersToRoles(Accounts.findUserByEmail('admin@ioos.us'), ['admin', 'approved']);
    Accounts.createUser({
      username: "lcampbell",
      email: "lcampbell@ioos.us",
      password: "bobpass",
      profile:{
        name: "Luke Campbell",
        email: "lcampbell@ioos.us",
        organization: "IOOS"
      }
    });
    Roles.addUsersToRoles(Accounts.findUserByEmail('lcampbell@ioos.us'), ['approved']);
    Accounts.createUser({
      username: "badams",
      email: "badams@ioos.us",
      password: "bobpass",
      profile:{
        name: "Ben Adams",
        email: "badams@ioos.us",
        organization: "IOOS"
      }
    });
    Meteor.users.update({}, {$set:{"emails.0.verified":true}}, {multi: true});
  }
});


Meteor.startup(function() {
  if(Meteor.settings.mail_url) {
    process.env.MAIL_URL = process.env.MAIL_URL || Meteor.settings.mail_url
  }

  Accounts.emailTemplates.siteName = "IOOS Harvest Registry";
  Accounts.emailTemplates.from = "ioos.us Administrator <admin@ioos.us>";
  Accounts.emailTemplates.verifyEmail = {
    subject() {
      return "Please verify your email address";
    },
    text(user, url) {
      let emailAddress   = user.emails[0].address,
      urlWithoutHash = url.replace( '#/verify-email', 'users/verify' ),
      supportEmail   = "lcampbell@ioos.us",
      emailBody      = `To verify your email address (${emailAddress}) visit the following link:\n\n${urlWithoutHash}\n\n If you did not request this verification, please ignore this email. If you feel something is wrong, please contact our support team: ${supportEmail}.`;

    return emailBody;
    }
  };

});

