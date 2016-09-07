import './organizations.jade';
import './organizations.less';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import 'meteor/mizzao:bootboxjs';

/*****************************************************************************/
/* organizations: Event Handlers */
/*****************************************************************************/
Template.organizations.events({
  'click .remove-organization'() {
    bootbox.confirm(
      "This action can not be reversed, the <b class='warning'>organization will be permanently removed</b>.<br>Are you sure?",
      (response) => {
        Meteor.call('organizations.remove', this._id, (error, response) => {
          if(error) {
            FlashMessages.sendError(error.message);
          } else {
            FlashMessages.sendSuccess("Organization deleted");
          }
        });
    });
  }
});

/*****************************************************************************/
/* organizations: Helpers */
/*****************************************************************************/
Template.organizations.helpers({
  organizations() {
    return Organizations.find({}, {sort: {name:1}});
  },
  pathTo(name) {
    return FlowRouter.path(name);
  },
  edit(organizationId) {
    return FlowRouter.path('editOrganization', {organizationId});
  }
});

/*****************************************************************************/
/* organizations: Lifecycle Hooks */
/*****************************************************************************/
Template.organizations.onCreated(function() {
  this.subscribe('organizations');
});

Template.organizations.onRendered(function() {
});

Template.organizations.onDestroyed(function() {
});
