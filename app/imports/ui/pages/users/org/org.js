import './org.jade';
import './org.less';
import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Users } from '/imports/api/users/users.js';
import { FlashMessages } from 'meteor/mrt:flash-messages';

export let formSchema = function(organizations) {
  return new SimpleSchema({
    organization: {
      label: "Organizations",
      type: [String],
      allowedValues: organizations,
      autoform: {
        type: "select-multiple"
      }
    }
  });
};

/*****************************************************************************/
/* usersOrgEdit: Event Handlers */
/*****************************************************************************/
Template.usersOrgEdit.events({
});

/*****************************************************************************/
/* usersOrgEdit: Helpers */
/*****************************************************************************/
Template.usersOrgEdit.helpers({
  formSchema() {
    let orgs = Organizations.find({}, {name: 1}).fetch();
    orgs = _.pluck(orgs, "name");
    return formSchema(orgs);
  },
  currentUser() {
    let user = Users.findOne({_id: FlowRouter.getParam("userId")});
    if(user) {
      console.log(user.profile.organization);
      return {
        organization: user.profile.organization
      };
    }
  }
});

/*****************************************************************************/
/* usersOrgEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.usersOrgEdit.onCreated(function() {
  this.autorun(() => {
    this.subscribe('reactiveUsers');
    this.subscribe("organizations");
  });
});

Template.usersOrgEdit.onRendered(function() {
});

Template.usersOrgEdit.onDestroyed(function() {
});


/*****************************************************************************/
/* AutoForm Hooks */
/*****************************************************************************/
AutoForm.hooks({
  editUserOrganization: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();
      insertDoc.user_id = FlowRouter.getParam("userId");

      Meteor.call("users.set_organization", insertDoc, (error, response) => {
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
        FlashMessages.sendSuccess("Organization Updated");
        FlowRouter.go("users");
      });
    }
  }
});
