import './dashboard-heading.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Attempts } from '/imports/api/attempts/attempts.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { _ } from 'meteor/underscore';

Template.dashboardHeading.events({
  'click #records'() {
    if(!_.isUndefined(this._id)) {
      FlowRouter.go('records', {harvestId: this._id});
    }
  }
});

Template.dashboardHeading.helpers({
  dataSources() {
    return Harvests.find({}).count();
  },
  records() {
    // For now, we don't have a collection, so just return a number
    let attempt = Attempts.findOne({parent_harvest: this._id}, {sort: {date: -1}});
    if(!attempt) {
      return;
    }
    return attempt.num_records;
  },
  attempts() {
    // For now, we don't have a collection, so just return a number
    return Attempts.find({parent_harvest: this._id}).count() || null;
  },
  errors() {
    // For now, we don't have a collection, so just return a number
    return Attempts.find({parent_harvest: this._id, successful: false}).count() || null;
  }
});

Template.dashboardHeading.onCreated(function() {
  this.subscribe('attempts.public');
});


