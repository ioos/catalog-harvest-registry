import './harvests-edit.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { AutoForm } from 'meteor/aldeed:autoform';

let formSchema = function() {
  let user = Meteor.user();
  let userOrg = user.profile.organization;

  return new SimpleSchema([Harvests.schema.pick(["name", "url", "harvest_interval", "harvest_type"]), {
    organization: {
      type: String,
      allowedValues: [userOrg],
      defaultValue: userOrg
    }
  }]);
};


/*****************************************************************************/
/* harvestsEdit: Event Handlers */
/*****************************************************************************/
Template.harvestsEdit.events({
  'click #cancel-btn'(event, instance) {
    instance.state.set('editMode', false);
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
});

Template.harvestsEdit.onRendered(function() {
});

Template.harvestsEdit.onDestroyed(function() {
});


