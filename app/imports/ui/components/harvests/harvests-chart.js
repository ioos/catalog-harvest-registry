import './harvests-chart.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { Attempts } from '/imports/api/attempts/attempts.js';
import { Meteor } from 'meteor/meteor';
import { nv } from 'meteor/nvd3:nvd3';
import { moment } from 'meteor/momentjs:moment';
import { FlashMessages } from 'meteor/mrt:flash-messages';
import { _ } from 'meteor/underscore';

/*****************************************************************************/
/* harvestsChart: Event Handlers */
/*****************************************************************************/

let activateHarvest = function(harvest) {
    addHarvesting.call(this, harvest._id);
    Meteor.setTimeout(() => {
      removeHarvesting.call(this, harvest._id);
    }, 60000);

    Meteor.call('harvests.activate', harvest._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        removeHarvesting.call(this, harvest._id);
        return;
      }
      FlashMessages.sendSuccess("Harvest Job Queued");
      removeHarvesting.call(this, harvest._id);
    });
};

let addHarvesting = function(harvestId) {
  let harvesting = this.state.get('harvesting');
  harvesting.push(harvestId);
  this.state.set('harvesting', harvesting);
};

let removeHarvesting = function(harvestId) {
  let harvesting = this.state.get('harvesting');
  let i = harvesting.indexOf(harvestId);
  if(i > -1) {
    harvesting.splice(i, 1);
    this.state.set('harvesting', harvesting);
  }
};

Template.harvestsChart.events({
  'click #edit-harvest-btn'(event, instance) {
    event.preventDefault();
    instance.state.set('editMode', true);
  },
  'click #activate-harvest-btn'(event, instance) {
    event.preventDefault();
    activateHarvest.call(instance, this);
  },
  'click #view-records-btn'(event, instance) {
    FlowRouter.go('records', {harvestId: this._id});
  },
  'click #delete-harvest-btn'(event, instance) {
    bootbox.confirm(
      "This action can not be reversed, the <b class='warning'>harvest will be permanently removed</b>.<br>Are you sure?",
      (response) => {
        if(response === false) {
          return;
        }
        Meteor.call('harvests.remove', instance.state.get('harvestId'), (error, response) => {
          if(error) {
            FlashMessages.sendError(error.message);
          } else {
            FlashMessages.sendSuccess("Harvest deleted");
            instance.state.set('harvestId', null);
            instance.state.set('editMode', false);
          }
        });
      }
    );
  },
  'click #edit-harvest'(event, instance) {
    instance.state.set('editMode', true);
  },
  'click #harvest-now'(event, instance) {
    activateHarvest.call(instance, this);
  }
});

Template.harvestsChart.activateHarvest = function() {
};

/*****************************************************************************/
/* harvestsChart: Helpers */
/*****************************************************************************/
Template.harvestsChart.helpers({
  drawChart() {
    Template.harvestsChart.renderChart.call(Template.instance());
    return null;
  }
});

/*****************************************************************************/
/* harvestsChart: Lifecycle Hooks */
/*****************************************************************************/

var addDonutChart = function(selector, data) {
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

        d3.select(selector)
          .datum(data())
          .transition().duration(350)
          .call(chart);

    return chart;
  });
};


Template.harvestsChart.onCreated(function() {
  this.subscribe('attempts.public');
});


Template.harvestsChart.renderChart = function() {
  let harvest = this.data;
  let good = 0;
  let bad = 0;
  let attempts = Attempts.find({parent_harvest: harvest._id}).forEach((attempt) => {
    if(attempt.successful) {
      good += 1;
    } else {
      bad += 1;
    }
  });
  addDonutChart("#chart svg", () => {
    return  [
        { 
          "label": "Good",
          "value" : good
        } , 
        { 
          "label": "Errors",
          "value" : bad
        }
      ];
  });
};

Template.harvestsChart.onRendered(function() {
});

Template.harvestsChart.onDestroyed(function() {
});

Template.harvestSummary.helpers({
  harvestDate() {
    if(_.isNull(this.last_harvest_dt) || _.isUndefined(this.last_harvest_dt)) {
      return "Never";
    }

    return moment(this.last_harvest_dt).fromNow();
  },
  harvesting() {
    let harvesting = Template.instance().state.get('harvesting');
    return _.contains(harvesting, this._id);
  }
});

Template.harvestSummary.onRendered(function() {
  this.$('#edit-harvest').tooltip();
  this.$('#harvest-now').tooltip();
});
