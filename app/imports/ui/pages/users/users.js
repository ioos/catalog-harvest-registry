import './users.jade';
import './users.less';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Users } from '/imports/api/users/users.js';
import { _ } from 'meteor/underscore';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import 'meteor/mizzao:bootboxjs';

/*****************************************************************************/
/* users: Event Handlers */
/*****************************************************************************/
Template.users.events({
  'click .enable-approved'(event, instance) {
    Meteor.call('approveAccount', this._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.message);
      }
    });
  },
  'click .disable-approved'(event, instance) {
    Meteor.call('disapproveAccount', this._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.message);
      }
    });
  },
  'click .enable-admin'(event, instance) {
    Meteor.call('enableAdmin', this._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.message);
      }
    });
  },
  'click .disable-admin'(event, instance) {
    Meteor.call('disableAdmin', this._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.message);
      }
    });
  },
  'click .remove-account'(event, instance) {
    bootbox.confirm(
      "This action can not be reversed, the <b class='warning'>account will be permanently removed</b>.<br>Are you sure?",
      (response) => {
        if(response) {
          Meteor.call('removeAccount', this._id, (error, response) => {
            if(error) {
              FlashMessages.sendError(error.message);
            } else {
              FlashMessages.sendSuccess("Account deleted");
            }
          });
        }
    });
  }
});

/*****************************************************************************/
/* users: Helpers */
/*****************************************************************************/
Template.users.helpers({
  users() {
    return Users.find({});
  },
});

/*****************************************************************************/
/* users: Lifecycle Hooks */
/*****************************************************************************/
Template.users.onCreated(function() {
  this.subscribe('reactiveUsers');
});

Template.users.onRendered(function() {
});

Template.users.onDestroyed(() => {
});


/*****************************************************************************/
/* userRow: Helpers */
/*****************************************************************************/
Template.userRow.helpers({
  hasRole(roles, role) {
    return _.contains(roles, role);
  },
  organization() {
    return this.profile.organization.join(", ");
  },
  editUserOrgPath() {
    return FlowRouter.path("usersOrgEdit", {userId: this._id});
  }
});
