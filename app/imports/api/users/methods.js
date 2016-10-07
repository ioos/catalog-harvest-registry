import { Roles } from 'meteor/alanning:roles';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { UserSchema } from '/imports/api/users/users.js';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


const sendNotificationEmail = function(user) {
  if(_.isEmpty(Meteor.settings.email) || _.isEmpty(Meteor.settings.email.notification_list)) {
    console.error("Notification list is not configured");
    return;
  }
  let template = "A new user has registered for an account:\n" +
    "\n" +
    "Email: " + user.email + "\n" +
    "Name: " + user.name + "\n" +
    "Organization(s): " + user.organization.join(", ") + "\n" +
    "\n" + 
    "You can approve the account by logging in and visiting " + 
    Meteor.absoluteUrl("users") +
    "\n" +
    "Thanks!\n" +
    "IOOS Registry";
  Email.send({
    from: "ioos.us Administrator <admin@ioos.us>",
    to: Meteor.settings.email.notification_list,
    subject: "IOOS Registry New Registered User",
    text: template
  });
};

const sendAccountApprovedEmail = function(user) {
  let template = "Your user account has been approved by an administrator and you can now start using your account!\n" +
    Meteor.absoluteUrl() + 
    "\n" +
    "Thanks!\n" + 
    "IOOS Registry";

  Email.send({
    from: "ioos.us Administrator <admin@ioos.us>",
    to: user.profile.email,
    subject: "IOOS Registry - Welcome Aboard!",
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

export const updateAccount = new ValidatedMethod({
  name: "users.update",
  validate(user) {
    let schema = new SimpleSchema([UserSchema.pick(['email', 'name']), {
      current_password: {
        label: "Current Password",
        type: String,
      },
      password: {
        label: "Password",
        type: String,
        min: 8,
        optional: true
      }
    }]);
    schema.validator()(user);
  },
  run(user) {
    let currentUserId = Meteor.userId();
    let currentUser = Meteor.user();
    let foundUser = Meteor.users.findOne({'emails.address': user.email, _id: {$ne: currentUserId}});
    if(foundUser) {
      throw new Meteor.Error(400, "Email Already Exists");
    }
    let passwordCheck = Accounts._checkPassword(currentUser, {digest: user.current_password, algorithm: 'sha-256'});
    if(!_.isUndefined(passwordCheck.error)) {
      throw new Meteor.Error(401, "Invalid Credentials");
    }

    Meteor.users.update(currentUserId, {
      $set: {
        username: user.email,
        email: user.email,
        "profile.name": user.name,
        "profile.email": user.email
      }
    });
    if(!_.isUndefined(user.password)) {
      Accounts.setPassword(currentUserId, user.password, {logout: false});
    }
  }
});


export const sendReset = new ValidatedMethod({
  name: 'users.sendReset',
  validate: new SimpleSchema({
    email: {
      type: String,
      optional: true,
      regEx: SimpleSchema.RegEx.Email
    }
  }).validator(),
  run({email}) {
    if(Meteor.userId()) {
      Accounts.sendResetPasswordEmail(Meteor.userId());
    } else {
      let user = Accounts.findUserByEmail(email);
      if(_.isEmpty(user) || _.isEmpty(user._id)) {
        throw new Meteor.Error(404, "No such user account for " + email);
      }
      Accounts.sendResetPasswordEmail(user._id);
    }
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
    let user = Meteor.users.findOne({_id: userId});
    if(Roles.userIsInRole(currentUserId, "admin")) {
      Roles.addUsersToRoles(userId, "approved");
      if(user.services.approvalNotice !== true) {
        sendAccountApprovedEmail(user);
        Meteor.users.update({_id: userId}, {
          $set: {
            "services.approvalNotice": true
          }
        });
      }
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
    let user = Meteor.users.findOne({_id: userId});
    if(Roles.userIsInRole(currentUserId, "admin")) {
      Roles.addUsersToRoles(userId, ["admin", "approved"]);
      if(user.services.approvalNotice !== true) {
        sendAccountApprovedEmail(user);
        Meteor.users.update({_id: userId}, {
          $set: {
            "services.approvalNotice": true
          }
        });
      }
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
      throw new Meteor.Error(403, "Please check your email for your verification email.");
    }

    if(!Roles.userIsInRole(userId, "approved")) {
      throw new Meteor.Error(403, "Your account is pending an approval from an administrator.");
    }
    return true;
  }
});

