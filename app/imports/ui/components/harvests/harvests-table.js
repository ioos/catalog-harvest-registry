import './harvests-table.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';

/*****************************************************************************/
/* harvestsTable: Event Handlers */
/*****************************************************************************/
Template.harvestsTable.events({
  'click tr'(event, instance) {
    instance.state.set('doc', this);
    Template.harvestsChart.renderChart();
  }
});

/*****************************************************************************/
/* harvestsTable: Helpers */
/*****************************************************************************/
Template.harvestsTable.helpers({
  harvests: function() {
    let instance = Template.instance();
    let activeHarvest = instance.state.get('doc');
    let harvests = _.map(Harvests.find({}).fetch(), function(harvest) {
      harvest.active = false;
      if(activeHarvest && harvest._id == activeHarvest._id) {
        harvest.active = true;
      }
      return harvest;
    });
    
    return harvests;
  }
});

/*****************************************************************************/
/* harvestsTable: Lifecycle Hooks */
/*****************************************************************************/
Template.harvestsTable.onCreated(function() {
});

Template.harvestsTable.onRendered(function() {
});

Template.harvestsTable.onDestroyed(function() {
});
