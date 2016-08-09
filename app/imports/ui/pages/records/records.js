import './records.jade';
import './records.less';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Records } from '/imports/api/records/records.js';

/*****************************************************************************/
/* records: Event Handlers */
/*****************************************************************************/
Template.records.events({
});

/*****************************************************************************/
/* records: Helpers */
/*****************************************************************************/
Template.records.helpers({
  records: function() {
    return Records.find();
  }
});

/*****************************************************************************/
/* records: Lifecycle Hooks */
/*****************************************************************************/
Template.records.onCreated(function() {
  this.harvestId = () => FlowRouter.getParam('harvestId');
  this.autorun(() => {
    this.subscribe('records.inHarvest', this.harvestId());
  });
});

Template.records.onRendered(function() {
});

Template.records.onDestroyed(function() {
});
