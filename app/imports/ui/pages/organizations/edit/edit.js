import './edit.jade';
import './edit.less';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlashMessages } from 'meteor/mrt:flash-messages';

/*****************************************************************************/
/* editOrganization: Event Handlers */
/*****************************************************************************/
Template.editOrganization.events({
  'click #cancel-btn'() {
    FlowRouter.go('organizations');
  }
});

/*****************************************************************************/
/* editOrganization: Helpers */
/*****************************************************************************/
Template.editOrganization.helpers({
  organizationsCollection() {
    return Organizations;
  },
  organization() {
    return Organizations.findOne({_id: FlowRouter.getParam("organizationId")});
  }
});

/*****************************************************************************/
/* editOrganization: Lifecycle Hooks */
/*****************************************************************************/
Template.editOrganization.onCreated(function() {
  this.subscribe('organizations');
});

Template.editOrganization.onRendered(function() {
});

Template.editOrganization.onDestroyed(function() {
});

AutoForm.hooks({
  editOrganization: {
    onSuccess: function(formType, result) {
      FlashMessages.sendSuccess("Organization was successfully updated");
      FlowRouter.go('organizations');
    },
    onError: function(formType, error) {
      FlashMessages.sendError(error.reason);
    }
  }
});
