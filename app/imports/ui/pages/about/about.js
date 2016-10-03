import './about.jade';
import './about.less';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';

/*****************************************************************************/
/* about: Event Handlers */
/*****************************************************************************/
Template.about.events({
});

/*****************************************************************************/
/* about: Helpers */
/*****************************************************************************/
Template.about.helpers({
  harvests() {
    console.log(Harvests.find({}).count());
    return Harvests.find({}, {sort: {organization:1}});
  },
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  },
  recordCount() {
    let count = 0;
    Harvests.find({last_record_count: {$gt: 0}}).forEach(function(harvest) {
      count += harvest.last_record_count;
    });
    return count;
  }
});

/*****************************************************************************/
/* about: Lifecycle Hooks */
/*****************************************************************************/
Template.about.onCreated(function() {
  this.autorun(() => {
    this.subscribe('harvests.public');
  });
});

Template.about.onRendered(function() {
});

Template.about.onDestroyed(function() {
});

Template.currentHarvestsTable.helpers({
});
