import './harvests.jade';
import './harvests.less';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { nv } from 'meteor/nvd3:nvd3';
import { Harvests } from '/imports/api/harvests/harvests.js';

/*****************************************************************************/
/* harvests: Event Handlers */
/*****************************************************************************/
Template.harvests.events({
  'click tr'() {
    const instance = Template.instance();
    console.log(this);
    instance.state.set('active', this._id);
  }
});

/*****************************************************************************/
/* harvests: Helpers */
/*****************************************************************************/
Template.harvests.helpers({
  harvests: function() {
    const instance = Template.instance();
    let harvestId = instance.state.get('active');
    let harvests = _.map(Harvests.find({}).fetch(), function(harvest) {
      harvest.active = false;
      if(harvest._id == harvestId) {
        harvest.active = true;
      }
      return harvest;
    });
    
    return harvests;
  },
  activeHarvest: function() {
    const instance = Template.instance();
    let harvestId = instance.state.get('active');
    console.log(harvestId);
    console.log("Please tell me this gets called");
    if(harvestId) {
      console.log("Real harvestId");
      let harvest = Harvests.findOne({_id: harvestId});
      return harvest;

    }
    return {};
  }
});

/*****************************************************************************/
/* harvests: Lifecycle Hooks */
/*****************************************************************************/
Template.harvests.onCreated(function() {
  this.subscribe('harvests.public');
  this.state = new ReactiveDict();
  this.state.set("active", null);
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
