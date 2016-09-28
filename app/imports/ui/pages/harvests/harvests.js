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

export const pageState = new ReactiveDict();

/* Bind page state to other templates */
Template.harvestsTable.onCreated(function() {
  this.state = pageState;
});

Template.harvestsChart.onCreated(function() {
  this.state = pageState;
});

Template.harvestSummary.onCreated(function() {
  this.state = pageState;
});

Template.harvestsEdit.onCreated(function() {
  this.state = pageState;
});


Template.harvests.events({
  'click #new-harvest'() {
    pageState.set('editMode', true);
    pageState.set('harvestId', null);
  }
});

Template.harvests.helpers({
  editMode() {
    let instance = Template.instance();
    return instance.state.get('editMode');
  },
  activeHarvest() {
    let instance = Template.instance();
    let harvestId = instance.state.get('harvestId');
    return Harvests.findOne({_id: harvestId});
  },
  harvestSelected() {
    /*
     * If the subscription hasn't finished, getting a harvest will return
     * undefined. This helper will be triggered again by the invalidation once
     * the subscription is done, at that point findOne will return a
     * dictionary of the harvest object.
     */
    let harvestId = Template.instance().state.get('harvestId');
    let somethingSelected = harvestId !== null && 
                            !_.isEmpty(Harvests.findOne({_id: harvestId}));
    let editMode = Template.instance().state.get('editMode');
    return somethingSelected || editMode;
  }
});

Template.harvests.onCreated(function() {
  this.state = pageState;
  this.autorun(() => {
    this.subscribe('harvests.public');
    this.subscribe('organizations');
  });
  let harvestId = FlowRouter.getParam('harvestId') || null;
  // This is the referenced doc for the reset of the page. It gets set when a
  // user selects certain elements, like a row in a table of harvests.
  this.state.set("harvestId", harvestId);
  // This flag causes the edit form to appear
  this.state.set('editMode', false);
  // This list contains the documents that are actively being harvested
  this.state.set('harvesting', []);
});

Template.harvests.onRendered(() => {
  this.$('#new-harvest').tooltip();
  $('.row.box-header .box').hover(function() {
    $(this).toggleClass('box-hover');
  });
});

Template.harvests.onDestroyed(() => {
});

/*****************************************************************************/
/* Tabular Templates
/*****************************************************************************/

Template.harvestLink.helpers({
  parseUrl(url) {
    let tokens = url.split("//");
    return tokens[1].split("/")[0];
  }
});

Template.harvestCKANLink.events({
  'click'(event, instance) {
    event.stopPropagation();
  }
});

Template.harvestCKANLink.helpers({
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  },
  ckanHarvestURL() {
    let org = Organizations.findOne({name: this.organization});
    if(org) {
      return org.ckan_harvest_url;
    }
  }
});
