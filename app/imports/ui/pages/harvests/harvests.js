import './harvests.jade';
import './harvests.less';
import '../../components/harvests/dashboard-heading.js';
import '../../components/harvests/harvests-table.js';
import '../../components/harvests/harvests-chart.js';
import '../../components/harvests/harvests-edit.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { AutoForm } from 'meteor/aldeed:autoform';

const pageState = new ReactiveDict();

/* Bind page state to other templates */
Template.harvestsTable.onCreated(function() {
  this.state = pageState;
});

Template.harvestsChart.onCreated(function() {
  this.state = pageState;
});

Template.harvestsEdit.onCreated(function() {
  this.state = pageState;
});


Template.harvests.events({
  'click #new-harvest'() {
    pageState.set('editMode', true);
    pageState.set('doc', null);
  }
});

Template.harvests.helpers({
  editMode() {
    let instance = Template.instance();
    return instance.state.get('editMode');
  }
});

Template.harvests.onCreated(function() {
  this.state = pageState;
  this.subscribe('harvests.public');
  this.state.set("doc", null);
  this.state.set('editMode', false);
});

Template.harvests.onRendered(() => {
  $('.row.box-header .box').hover(function() {
    $(this).toggleClass('box-hover');
  });
});

Template.harvests.onDestroyed(() => {
});

/*****************************************************************************/
/* Form hooks
/*****************************************************************************/

AutoForm.hooks({
  harvestEdit: {
    onSuccess: function(formType, result) {
      FlashMessages.sendSuccess("Harvest was successfully added");
      pageState.set('editMode', false);
    }
  }
});
