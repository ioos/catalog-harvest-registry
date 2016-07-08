import './edit.jade';
import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Harvests } from '/imports/api/harvests/harvests.js';

Template.harvestsEdit.onCreated(function() {
  this.autorun(() => {
    Harvests.read(FlowRouter.getParam('harvestId'), (error, response) => {
      if(error) {
        Session.set('harvest', {error});
      } else if(response.length == 1) {
        Session.set('harvest', response[0]);
      } else {
        Session.set('harvest', {error: "Not Found"});
      }
    });
  });
});

Template.harvestsEdit.helpers({
  formSchema() {
    return Harvests.schema.pick(Harvests.formFields);
  },
  harvest() {
    return Session.get('harvest');
  },
  success() {
    return Session.get('success');
  }
});

AutoForm.hooks({
  editHarvest: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      this.done();
    },
    onSuccess: function(formType, result) {
      // Don't redirect
      this.event.preventDefault();
      Session.set('success', true);
    }
  }
});
