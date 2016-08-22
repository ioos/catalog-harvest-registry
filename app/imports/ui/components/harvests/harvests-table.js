import './harvests-table.jade';
import { Template } from 'meteor/templating';
import { Harvests, HarvestsTable } from '/imports/api/harvests/harvests.js';

/*****************************************************************************/
/* harvestsTable: Event Handlers */
/*****************************************************************************/
Template.harvestsTable.events({
  'click tr'(event, instance) {
    let dataTable = $(event.target).closest('table').DataTable();
    let table = $(event.target).closest('table');
    $(table).find('tr').removeClass('active');
    let rowData = dataTable.row(event.currentTarget).data();
    if (!rowData) {
      $('#harvests-table').removeClass('box-6').addClass('box-12');
      $('#sources-box').removeClass('box-3').addClass('box-12');
      Meteor.setTimeout(() => {
        instance.state.set('harvestId', null);
      }, 500);
    } else {
      $(event.target).closest('tr').addClass('active');
      $('#harvests-table').removeClass('box-12').addClass('box-6');
      $('#sources-box').removeClass('box-12').addClass('box-3');
      Meteor.setTimeout(() => {
        instance.state.set('harvestId', rowData._id);
      }, 500);
    }
  }
});

/*****************************************************************************/
/* harvestsTable: Helpers */
/*****************************************************************************/
Template.harvestsTable.helpers({
  harvestsTable: function() {
    let instance = Template.instance();
    HarvestsTable.options.createdRow = function(row, data, dataIndex) {
      if(instance.state.get('harvestId') == data._id) {
        $(row).addClass('active');
      }
    };
    return HarvestsTable;
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
