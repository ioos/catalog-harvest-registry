import './new.jade';
import './new.less';
import { Template } from 'meteor/templating';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { _ } from 'meteor/underscore';
import 'meteor/mizzao:bootboxjs';


export let formSchema = function(organizations) {
  return new SimpleSchema({
    email: {
      label: "Email",
      type: String,
      regEx: SimpleSchema.RegEx.Email
    },
    name: {
      label: "Full Name",
      type: String
    },
    organization: {
      label: "Organization",
      type: String,
      allowedValues: organizations
    },
    password: {
      label: "Password",
      type: String,
      min: 8,
      autoform: {
        label: "Password",
        type: "password"
      }
    },
    password_confirm: {
      label: "Password Confirm",
      type: String,
      custom: function() {
        if(this.value !== this.field('password').value) {
          return 'passwordMismatch';
        }
      },
      autoform: {
        type: "password"
      }
    }
  });
};

SimpleSchema.messages({
  passwordMismatch: "Passwords do not match"
});

/*****************************************************************************/
/* usersNew: Event Handlers */
/*****************************************************************************/
Template.usersNew.events({
  'click #resend-link'(event, instance) {
    event.preventDefault();
    bootbox.prompt("Please enter your email address", (email) => {
      if(email === null) {
        return;
      }
      Meteor.call('sendVerificationLink', email, (error, response) => {
        if(error) {
          FlashMessages.sendError(error.reason);
        } else {
          FlashMessages.sendSuccess("Email sent. Please check your email for the verification link");
        }
      });
    });
  }
});

/*****************************************************************************/
/* usersNew: Helpers */
/*****************************************************************************/
Template.usersNew.helpers({
  formSchema() {
    let orgs = Organizations.find({}, {name: 1}).fetch();
    orgs = _.pluck(orgs, 'name');
    return formSchema(orgs);
  }
});

/*****************************************************************************/
/* usersNew: Lifecycle Hooks */
/*****************************************************************************/
Template.usersNew.onCreated(function() {
  this.autorun(()=> {
    this.subscribe("organizations");
  });
});

Template.usersNew.onRendered(() => {
});

Template.usersNew.onDestroyed(() => {
});

AutoForm.hooks({
  newUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      delete insertDoc.password_confirm;
      Meteor.call('users.insert', insertDoc, (error, repsonse) => {
        if(error) {
          if(error.reason) {
            FlashMessages.sendError(error.reason);
          } else {
            FlashMessages.sendError(error.message);
          }
          this.done(error);
          return;
        } 
        bootbox.alert("<p>Your user account has been created, you should see a verification email shortly.</p>" +
                      "<p>An administrator will review your request and once your account is approved, you wil" +
                      "l be able to log in.</p>", () => {
                        this.done();
                        FlowRouter.go('login');
                      });
      });
    }
  }
});
