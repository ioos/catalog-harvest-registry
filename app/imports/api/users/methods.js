import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

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
  approveAccount: function(userId, callback) {
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
  disapproveAccount: function(userId, callback) {
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
  enableAdmin: function(userId, callback) {
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
  disableAdmin: function(userId, callback) {
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
  removeAccount: function(userId, callback) {
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
  }
});

