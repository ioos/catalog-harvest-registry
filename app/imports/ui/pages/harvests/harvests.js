import './harvests.jade';
import './harvests.less';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { nv } from 'meteor/nvd3:nvd3';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Organizations } from '/imports/api/organizations/organizations.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { AutoForm } from 'meteor/aldeed:autoform';

const pageState = new ReactiveDict();

/*****************************************************************************/
/* harvests: Event Handlers */
/*****************************************************************************/
Template.harvests.events({
  'click #new-harvest'() {
    pageState.set('editMode', true);
  }
});

/*****************************************************************************/
/* harvests: Helpers */
/*****************************************************************************/
Template.harvests.helpers({
  activeHarvest: function() {
    let harvestId = pageState.get('active');
    if(harvestId) {
      let harvest = Harvests.findOne({_id: harvestId});
      return harvest;
    }
    return {};
  },
  editMode() {
    return pageState.get('editMode');
  }
});

/*****************************************************************************/
/* harvests: Lifecycle Hooks */
/*****************************************************************************/
Template.harvests.onCreated(function() {
  this.subscribe('harvests.public');
  pageState.set("active", null);
  pageState.set('editMode', false);
});


/*****************************************************************************/
/* Pie Chart stuff
/*****************************************************************************/
var exampleData = function() {
  return  [
      { 
        "label": "Good",
        "value" : 20
      } , 
      { 
        "label": "Errors",
        "value" : 5
      }
    ];
};

var addDonutChart = function() {
  //Donut chart example
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .showLabels(true)     //Display pie labels
        .labelThreshold(0.05)  //Configure the minimum slice size for labels to show up
        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
        ;

      d3.select("#chart svg")
          .datum(exampleData())
          .transition().duration(350)
          .call(chart);

    return chart;
  });
};

Template.harvests.onRendered(() => {
  addDonutChart();
  $('.row.box-header .box').hover(function() {
    $(this).toggleClass('box-hover');
  });

});

Template.harvests.onDestroyed(() => {
});


Template.harvestsTable.helpers({
  harvests: function() {
    let harvestId = pageState.get('active');
    let harvests = _.map(Harvests.find({}).fetch(), function(harvest) {
      harvest.active = false;
      if(harvest._id == harvestId) {
        harvest.active = true;
      }
      return harvest;
    });
    
    return harvests;
  }
});

Template.harvestsTable.events({
  'click tr'() {
    pageState.set('active', this._id);
  }
});

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


Template.harvestEdit.events({
  'click #cancel-btn'(event, instance) {
    pageState.set('editMode', false);
  }
});


Template.harvestEdit.helpers({
  formSchema() {
    return formSchema();
  }
});

AutoForm.hooks({
  harvestEdit: {
    onSuccess: function(formType, result) {
      FlashMessages.sendSuccess("Harvest was successfully added");
      pageState.set('editMode', false);
    },
    onError: function(formType, error) {
      FlashMessages.sendError(error.reason);
      pageState.set('editMode', false);
    }
  }
});
