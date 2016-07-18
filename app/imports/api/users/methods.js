import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { UserSchema } from '/imports/api/users/users.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';
import { FlowRouter } from 'meteor/kadira:flow-router';


sendNotificationEmail = function(user) {
  if(!Meteor.settings.email || !Meteor.settings.notification_list) {
    return;
  }
  let template = "A new user has registered for an account:\n" +
    "\n" +
    "Email: " + user.email + "\n" +
    "Name: " + user.name + "\n" +
    "Organization: " + user.organization + "\n" +
    "\n" + 
    "You can approve the account by logging in and visiting " + 
    Meteor.absoluteUrl("users") +
    "\n" +
    "Thanks!\n" +
    "ioos.us Admin";
  Email.send({
    from: "ioos.us Administrator <admin@ioos.us>",
    to: Meteor.settings.email.notification_list,
    subject: "ioos.us New Registered User",
    text: template
  });
};


export const registerAccount = new ValidatedMethod({
  name: "users.insert",
  validate: UserSchema.validator({clean: true, filter: false}),
  run(user) {
    let insertDoc = {
      username: user.email,
      email: user.email,
      password: user.password,
      profile: {
        name: user.name,
        email: user.email,
        organization: user.organization
      }
    };
    Accounts.createUser(insertDoc);  

    let registeredUser = Accounts.findUserByEmail(user.email);
    Accounts.sendVerificationEmail(registeredUser._id);
    sendNotificationEmail(user);
  }
});

Meteor.methods({
  /*
   * Wraps the Meteor.users collection into a client-safe collection so that
   * the client can see reactive changes to user documents.
   *
   * Subscribe to this if you need to see reactive changes to user content.
   */
  userIsInRole: function(userId, roles) {
    let response = Meteor.wrapAsync((userId, roles, callback) => {

      let errorCode;
      let errorMessage;
      let myError;

      try {
        let answer = Roles.userIsInRole(userId, roles);
        callback(null, answer);
      } catch (error) {
        console.error(error);
        if(error.response) {
          errorCode = error.response.data.code;
          errorMessage = error.response.data.message;
        } else {
          errorCode = 500;
          errorMessage = "Server Error, please check the logs";
        }
        myError = new Meteor.Error(errorCode, errorMessage);
        callback(myError, null);
      }
    })(userId, roles);
    return response;
  },
  /*
   * Adds a user to the approved role
   */
  approveAccount: function(userId) {
    let currentUserId = Meteor.userId();
    if(Roles.userIsInRole(currentUserId, "admin")) {
      Roles.addUsersToRoles(userId, "approved");
    } else {
      throw new Meteor.Error(401, "Unauthorized");
    }
  },
  /*
   * Removes a user from the approved role
   */
  disapproveAccount: function(userId) {
    let currentUserId = Meteor.userId();
    if(currentUserId == userId) {
      throw new Meteor.Error(400, "You can not disapprove your own account.");
    }
    if(Roles.userIsInRole(currentUserId, "admin")) {
      Roles.removeUsersFromRoles(userId, "approved");
    } else {
      throw new Meteor.Error(401, "Unauthorized");
    }
  },
  /*
   * Adds a user to the admin role
   */
  enableAdmin: function(userId) {
    let currentUserId = Meteor.userId();
    if(Roles.userIsInRole(currentUserId, "admin")) {
      Roles.addUsersToRoles(userId, ["admin", "approved"]);
    } else {
      throw new Meteor.Error(401, "Unauthorized");
    }
  },
  /*
   * Removes a user from the admin role.
   *
   * Note, you can not remove yourself, and there can never be less than one
   * admin.
   */
  disableAdmin: function(userId) {
    let currentUserId = Meteor.userId();
    if(currentUserId == userId) {
      throw new Meteor.Error(400, "You can not remove yourself from the admin role.");
    }
    if(Roles.userIsInRole(currentUserId, "admin")) {
      let admins = Roles.getUsersInRole('admin');
      if(admins.count() < 2) {
        throw new Meteor.Error(400, "System must have at least one admin.");
      }
      Roles.removeUsersFromRoles(userId, "admin");
    } else {
      throw new Meteor.Error(401, "Unauthorized");
    }
  },
  /*
   * Removes an account.
   *
   * Users can not remove their own account, even admins.
   */
  removeAccount: function(userId) {
    let currentUserId = Meteor.userId();
    if(currentUserId == userId) {
      throw new Meteor.Error(400, "You can not remove your own account.");
    }
    if(Roles.userIsInRole(currentUserId, "admin")) {
      // If an error is thrown the client will see it.
      Meteor.users.remove({_id: userId});
    } else {
      throw new Meteor.Error(401, "Unauthorized");
    }
  },

  /*
   * Send the user a verification email.
   */
  sendVerificationLink: function(email) {
    let user = Accounts.findUserByEmail(email);
    if(_.isEmpty(user) || _.isEmpty(user._id)) {
      throw new Meteor.Error(404, "No such user account for " + email);
    }
    Accounts.sendVerificationEmail(user._id);
  },

  /*
   * Verifies that the account is valid
   */
  isValidUser: function(userId) {
    let user = Meteor.users.findOne({_id: userId});
    let verifiedEmails = _.where(user.emails, {verified: true});
    if(verifiedEmails.length < 1) {
      throw new Meteor.Error(403, "Account is not verified");
    }

    if(!Roles.userIsInRole(userId, "approved")) {
      throw new Meteor.Error(403, "Account is not approved.");
    }
    return true;
  }
});

