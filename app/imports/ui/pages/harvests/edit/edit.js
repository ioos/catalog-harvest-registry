import './edit.jade';
import './edit.less';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { AutoForm } from 'meteor/aldeed:autoform';

/*****************************************************************************/
/* harvestsEdit: Event Handlers */
/*****************************************************************************/
Template.harvestsEdit.events({
});

/*****************************************************************************/
/* harvestsEdit: Helpers */
/*****************************************************************************/
Template.harvestsEdit.helpers({
  harvest() {
    let shouldFind = Harvests.findOne(FlowRouter.getParam('harvestId'));
    return shouldFind;
  },
  formSchema() {
    return Harvests.schema.pick(['name', 'org', 'url', 'harvest_type', 'harvest_interval']);
  }
});

/*****************************************************************************/
/* harvestsEdit: Lifecycle Hooks */
/*****************************************************************************/
Template.harvestsEdit.onCreated(function () {
  this.subscribe('harvests.public');
});

Template.harvestsEdit.onRendered(() => {
});

Template.harvestsEdit.onDestroyed(() => {
});

AutoForm.debug();
AutoForm.hooks({
  editHarvest: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault(); 
      console.log("calling harvests.update");
      insertDoc._id = currentDoc._id;
      Meteor.call('harvests.update', insertDoc);
      this.done();
    } 
  }
}); 
