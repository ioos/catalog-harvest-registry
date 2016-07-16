import './harvests-edit.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Roles } from 'meteor/alanning:roles';
import { _ } from 'meteor/underscore';
import 'meteor/mizzao:bootboxjs';

let formSchema = function() {
  let user = Meteor.user();
  let organizations = [user.profile.organization];
  if(Roles.userIsInRole(user._id, ['admin'])) {
    console.log("User is admin");
    organizations = _.map(Organizations.find({}, {name: 1}).fetch(), (org)=> {
      return org.name;
    });
    console.log(organizations);
  }

  return new SimpleSchema([Harvests.schema.pick(["name", "url", "harvest_interval", "harvest_type", "publish"]), {
    organization: {
      type: String,
      allowedValues: organizations,
      defaultValue: organizations[0]
    }
  }]);
};


/*****************************************************************************/
/* harvestsEdit: Event Handlers */
/*****************************************************************************/
Template.harvestsEdit.events({
  'click #cancel-btn'(event, instance) {
    instance.state.set('editMode', false);
  },
  'click #remove-harvest'(event, instance) {
    bootbox.confirm(
      "This action can not be reversed, the <b class='warning'>harvest will be permanently removed</b>.<br>Are you sure?",
      (response) => {
        Meteor.call('harvests.remove', instance.state.get('doc')._id, (error, response) => {
          if(error) {
            FlashMessages.sendError(error.message);
          } else {
            FlashMessages.sendSuccess("Harvest deleted");
            instance.state.set('doc', null);
            instance.state.set('editMode', false);
          }
        });
      }
    );
  }
});

/*****************************************************************************/
/* harvestsEdit: Helpers */
/*****************************************************************************/
Template.harvestsEdit.helpers({
  formSchema() {
    return formSchema();
  },
  update() {
    let instance = Template.instance();
    let retval = instance.state.get('doc') !== null;
    return retval;
  },
  doc() {
    let instance = Template.instance();
    return instance.state.get('doc');
  }
});

/*****************************************************************************/
/* harvestsEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.harvestsEdit.onCreated(function() {
  this.subscribe("organizations");
});

Template.harvestsEdit.onRendered(function() {
});

Template.harvestsEdit.onDestroyed(function() {
});


