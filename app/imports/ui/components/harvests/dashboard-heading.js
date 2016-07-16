import './dashboard-heading.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';

Template.dashboardHeading.events({
});

Template.dashboardHeading.helpers({
  dataSources() {
    return Harvests.find({}).count();
  },
  recoreds() {
    // For now, we don't have a collection, so just return a number
    return Math.floor(Math.random() * 10);
  },
  notifications() {
    // For now, we don't have a collection, so just return a number
    return Math.floor(Math.random() * 10);
  },
  errors() {
    // For now, we don't have a collection, so just return a number
    return Math.floor(Math.random() * 10);
  }
});

Template.dashboardHeading.onCreated(function() {
});


