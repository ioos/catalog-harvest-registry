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
let activateHarvest = function(harvest, observer, ignorePublish=false) {
  if(ignorePublish || harvest.publish) {
    Meteor.call('harvests.activate', harvest._id, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        return;
      }
      FlashMessages.sendSuccess("Harvest Job Queued");
      observer.addListener(harvest, (newDoc, oldDoc) => {
        if(newDoc.last_harvest_dt != oldDoc.last_harvest_dt && (newDoc.last_harvest_dt instanceof Date)) {
          if(newDoc.last_harvest_status == "ok") {
            FlashMessages.sendSuccess(`Harvest for ${newDoc.name} suceeded`);
          } else if(newDoc.last_harvest_status == "fail") {
            FlashMessages.sendError(`Harvest for ${newDoc.name} failed`);
          }
          observer.removeListener(harvest);
        }
      });
    });
  } else {
    bootbox.confirm(
      "This harvest is not set to publish. Publish anyway?",
      (response) => {
        if(response === false) {
          return;
        }
        activateHarvest(harvest, observer, true);
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
    activateHarvest.call(instance, this.harvest, this.observer);
  },
  'click #view-records-btn'(event, instance) {
    FlowRouter.go('records', {harvestId: this.harvest._id});
  },
  'click #view-jobs-btn'(event, instance) {
    FlowRouter.go('showJobs', {organization: this.harvest.organization}, {"harvest": this.harvest._id});
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
            FlashMessages.sendSuccess("Harvest scheduled for deletion");
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
    activateHarvest.call(instance, this.harvest, this.observer);
  }
});

/*****************************************************************************/
/* harvestsChart: Helpers */
/*****************************************************************************/
Template.harvestsChart.helpers({
  drawChart() {
    Template.harvestsChart.renderChart.call(Template.instance());
    return null;
  },
  ownsHarvest() {
    let user = Meteor.user();
    let harvest = this.harvest;
    let isAdmin = Roles.userIsInRole(user._id, ["admin"]);
    if(!isAdmin && (!user || !_.contains(user.profile.organization, harvest.organization))) {
      return false;
    }
    return true;
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
  let harvest = this.data.harvest;
  let good = this.data.harvest.last_good_count;
  let bad = this.data.harvest.last_bad_count;
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
    return this.harvest.last_harvest_dt == "harvesting";
  },
  harvestDate() {
    if(_.isNull(this.harvest.last_harvest_dt) || _.isUndefined(this.harvest.last_harvest_dt)) {
      return "Never";
    }
    if(this.harvest.last_harvest_dt instanceof Date) {
      return moment(this.harvest.last_harvest_dt).fromNow();
    }
    return this.harvest.last_harvest_dt;
  },
  harvesting() {
    let harvesting = Template.instance().state.get('harvesting');
    return _.contains(harvesting, this.harvest._id);
  }
});

Template.harvestSummary.onRendered(function() {
  this.$('#edit-harvest').tooltip();
  this.$('#harvest-now').tooltip();
});
