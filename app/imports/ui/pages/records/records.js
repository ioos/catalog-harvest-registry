import './records.jade';
import './records.less';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Records, RecordsTable } from '/imports/api/records/records.js';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';


/*****************************************************************************/
/* records: Event Handlers */
/*****************************************************************************/
Template.records.events({
});

/*****************************************************************************/
/* records: Helpers */
/*****************************************************************************/
Template.records.helpers({
  recordsTable: function() {
    return RecordsTable;
  },
  recordsCount: function() {
    return Template.instance().state.get('recordsCount');
  },
  servicesCount: function() {
    return Template.instance().state.get('servicesCount');
  },
  errorCount: function() {
    return Template.instance().state.get('errorCount');
  },
  selector: function() {
    return {harvest_id: FlowRouter.getParam('harvestId')};
  }
});

/*****************************************************************************/
/* records: Lifecycle Hooks */
/*****************************************************************************/
Template.records.onCreated(function() {
  this.state = new ReactiveDict();
  this.harvestId = FlowRouter.getParam('harvestId');
});

Template.records.onRendered(function() {
  Meteor.call('records.errorCount', {harvestId: this.harvestId}, (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('errorCount', res);
    }
  });
  Meteor.call('records.servicesCount', {harvestId: this.harvestId}, (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('servicesCount', res);
    }
  });
  Meteor.call('records.count', {harvestId: this.harvestId}, (err, res) => {
    if(err) {
      console.error(err);
    } else {
      this.state.set('recordsCount', res);
    }
  });
});

Template.records.onDestroyed(function() {
});

/*****************************************************************************/
/* recordsServicesCell: Events */
/*****************************************************************************/

Template.recordsServicesCell.events({
  'click .collapse-services'(event) {
    event.preventDefault();
    let target = $(event.target);
    target.next().collapse('toggle');
  }
});

/*****************************************************************************/
/* recordsServicesCell: Helpers */
/*****************************************************************************/

Template.recordsServicesCell.helpers({
  recordServices: function() {
    return this.services.length;
  }
});

/*****************************************************************************/
/* recordsErrorCell: Events */
/*****************************************************************************/

Template.recordsErrorCell.events({
  'click .collapse-errors'(event) {
    event.preventDefault();
    let target = $(event.target);
    target.next().collapse('toggle');
  }
});

/*****************************************************************************/
/* recordsErrorCell: Helpers */
/*****************************************************************************/

Template.recordsErrorCell.helpers({
  recordErrors: function() {
    return this.validation_errors.length;
  }
});

/*****************************************************************************/
/* recordsCKANLink: Helpers */
/*****************************************************************************/

Template.recordsCKANLink.helpers({
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  },
  getCatalogURL: function() {
    if(!_.isEmpty(this.file_id)) {
      return "http://dev-catalog.ioos.us/dataset?" + $.param({q: 'guid:"' + this.file_id + '"'});
    }
    return "http://dev-catalog.ioos.us/dataset?" + $.param({q: '"' + this.title + '"'});
  }
});

/*****************************************************************************/
/* recordsDescription: Event Handlers */
/*****************************************************************************/

Template.recordsDescription.events({
  'click a'(event, instance) {
    Template.instance().state.set('expanded', true);
  }
});

/*****************************************************************************/
/* recordsDescription: Helpers */
/*****************************************************************************/

Template.recordsDescription.helpers({
  expanded() {
    return Template.instance().state.get('expanded');
  },
  shortDescription() {
    let description = this.description || "No Description Available";
    if(description.length > 200) {
      description = description.substr(0, 200) + "...";
    }
    return description;
  },
  needsExpand() {
    return this.description && this.description.length > 200;
  }
});

/*****************************************************************************/
/* recordsDescription: Life Cycle */
/*****************************************************************************/


Template.recordsDescription.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('expanded', false);
});
