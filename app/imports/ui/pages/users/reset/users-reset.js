import './users-reset.jade';
import './users-reset.less';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

/*****************************************************************************/
/* usersReset: Event Handlers */
/*****************************************************************************/
Template.usersReset.events({
  'submit'(event, instance) {
    event.preventDefault();
    instance.$('.form-group input').removeClass('error');
    let password = instance.$('#password').val();
    let passwordConfirm = instance.$('#password-confirm').val();
    if (password != passwordConfirm) {
      FlashMessages.sendError("Passwords do not match");
      instance.$('.form-group input').addClass('error');
      return;
    }
    if (password.length < 8) {
      FlashMessages.sendError("Passwords must be at least 8 characters");
      instance.$('.form-group input').addClass('error');
      return;
    }
    Accounts.resetPassword(FlowRouter.getParam('token'), password, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        return;
      }
      FlashMessages.sendSuccess("Password successfully updated.");
      FlowRouter.go('login');
    });
  }
});

/*****************************************************************************/
/* usersReset: Helpers */
/*****************************************************************************/
Template.usersReset.helpers({
});

/*****************************************************************************/
/* usersReset: Lifecycle Hooks */
/*****************************************************************************/
Template.usersReset.onCreated(function() {
});

Template.usersReset.onRendered(function() {
});

Template.usersReset.onDestroyed(function() {
});
