import './edit.jade';
import './edit.less';
import { Template } from 'meteor/templating';
import { formSchema } from '../new/new.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { SHA256 } from 'meteor/sha';

/*****************************************************************************/
/* usersEdit: Event Handlers */
/*****************************************************************************/
Template.usersEdit.events({
  'click #reset'(event) {
    event.preventDefault();

    Meteor.call('users.sendReset', {email: undefined}, (error, response) => {
      if(error) { 
        FlashMessages.sendError(error.reason);
        return;
      }
      FlashMessages.sendSuccess("We have sent a password reset to your email");
    });
  }
});

/*****************************************************************************/
/* usersEdit: Helpers */
/*****************************************************************************/
Template.usersEdit.helpers({
  currentUser() {
    let user = Meteor.user();
    return {
      email: user.profile.email,
      name: user.profile.name,
      organization: user.profile.organization
    };
  },
  /**
   * Returns a modified schema of the new user form. In this modified version,
   * passwords are optional and the labels are modified.
   */
  formSchema() {
    // Get the organization names for the organizations dropdown.
    let orgs = Organizations.find({}, {name: 1}).fetch();
    orgs = _.pluck(orgs, 'name');
    // Build the form schema with the right orgs.
    let fullSchema = formSchema(orgs);
    // Set the password to optional and update the label to "New Password"
    let modifiedSchema = new SimpleSchema([fullSchema.pick(["email", "name", "organization"]), {
      current_password: {
        label: "Current Password",
        type: String,
        autoform: {
          type: "password"
        }
      },
      password: {
        label: "New Password",
        type: String,
        optional: true,
        min: 8,
        autoform: {
          type: "password"
        }
      },
      password_confirm: {
        label: "New Password Confirm",
        type: String,
        optional: true,
        custom: function() {
          if(this.value !== this.field('password').value) {
            return 'passwordMismatch';
          }
        },
        autoform: {
          type: "password"
        }
      }
    }]);
    return modifiedSchema;
  }
});

/*****************************************************************************/
/* usersEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.usersEdit.onCreated(function() {
  this.autorun(()=> {
    this.subscribe("organizations");
    this.subscribe("reactiveUsers");
  });
});

Template.usersEdit.onRendered(function() {
});

Template.usersEdit.onDestroyed(function() {
});

/*****************************************************************************/
/* AutoForm Hooks */
/*****************************************************************************/
AutoForm.hooks({
  editUser: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      // We just needed to make sure, client-side, that the passwords matched.
      // The server-side just needs a value.
      delete insertDoc.password_confirm;
      insertDoc.current_password = SHA256(insertDoc.current_password);
      Meteor.call("users.update", insertDoc, (error, response) => {
        if(error) {
          console.error(error);
          if(error.reason) {
            FlashMessages.sendError(error.reason);
          } else {
            FlashMessages.sendError(error.message);
          }
          this.done(error);
          return;
        }
        FlashMessages.sendSuccess("Account information updated");
        FlowRouter.go("harvests");
      });
    }
  }
});
