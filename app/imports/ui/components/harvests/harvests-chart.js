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

/**
 * Creates a new harvest job for the harvest passed in. If the harvest does not
 * have publishing enabled, a bootbox prompt will confirm.
 *
 * @param {harvest} harvest - An item from the Harvests collection
 * @param {Boolean} ignorePublish - If false and the harvest does not have
 *                                  publish set to true, a prompt will display,
 *                                  asking the user to confirm that he/she
 *                                  wants to harvest.
 */
let activateHarvest = function(harvest, ignorePublish=false) {
  if(ignorePublish || harvest.publish) {
    Meteor.call('harvests.activate', harvest._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        return;
      }
      FlashMessages.sendSuccess("Harvest Job Queued");
    });
  } else {
    bootbox.confirm(
      "This harvest is not set to publish. Publish anyway?",
      (response) => {
        if(response === false) {
          return;
        }
        activateHarvest(harvest, true);
      }
    );
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
        .valueFormat(d3.format(",.0d"))
        ;

        d3.select(selector)
          .datum(data())
          .transition().duration(350)
          .call(chart);

    for(var property in chart.legend.dispatch) {
      chart.legend.dispatch[property] = function() {};
    }
    return chart;
  });
};


Template.harvestsChart.onCreated(function() {
  this.autorun(() => {
    this.subscribe('harvests.public');
  });
});


Template.harvestsChart.renderChart = function() {
  let harvest = this.data;
  let good = this.data.last_good_count;
  let bad = this.data.last_bad_count;
  addDonutChart("#chart svg", () => {
    return  [
        { 
          "label": "Clean Records",
          "value" : good
        } , 
        { 
          "label": "Bad Records",
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
  isHarvesting() {
    return this.last_harvest_dt == "harvesting";
  },
  harvestDate() {
    if(_.isNull(this.last_harvest_dt) || _.isUndefined(this.last_harvest_dt)) {
      return "Never";
    }
    if(this.last_harvest_dt instanceof Date) {
      return moment(this.last_harvest_dt).fromNow();
    }
    return this.last_harvest_dt;
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
