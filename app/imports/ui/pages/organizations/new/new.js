import './new.jade';
import './new.less';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { AutoForm } from 'meteor/aldeed:autoform';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlashMessages } from 'meteor/mrt:flash-messages';

/*****************************************************************************/
/* newOrganization: Event Handlers */
/*****************************************************************************/
Template.newOrganization.events({
  'click #cancel-btn'() {
    FlowRouter.go('organizations');
  }
});

/*****************************************************************************/
/* newOrganization: Helpers */
/*****************************************************************************/
Template.newOrganization.helpers({
  organizationsCollection() {
    return Organizations;
  }
});

/*****************************************************************************/
/* newOrganization: Lifecycle Hooks */
/*****************************************************************************/
Template.newOrganization.onCreated(function() {
});

Template.newOrganization.onRendered(function() {
});

Template.newOrganization.onDestroyed(function() {
});

AutoForm.hooks({
  newOrganization: {
    onSuccess: function(formType, result) {
      FlashMessages.sendSuccess("Organization was successfully created");
      FlowRouter.go('organizations');
    },
    onError: function(formType, error) {
      FlashMessages.sendError(error.reason);
    }
  }
});
