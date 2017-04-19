import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import './about.jade';
import './about.less';

/*
 * about: Event Handlers
 */
Template.about.events({
});

/*
 * about: Helpers
 */
Template.about.helpers({
  /**
   * Returns the Harvests sorted by organization
   *
   * @return {Array<Harvest>}
   */
  harvests() {
    return Harvests.find({}, {sort: {organization: 1} });
  },
  /**
   * Returns the aboslute path for the URL.
   *
   * @param {string} path - Relative Path
   * @return {string}
   */
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  },
  /**
   * Returns the total number of records by summing last_record_count of each
   * Harvest
   *
   * @return {number}
   */
  recordCount() {
    let count = 0;
    Harvests.find({last_record_count: {$gt: 0} }).forEach((harvest) => {
      count += harvest.last_record_count;
    });
    return count;
  },
  /**
   * Returns the total number of bad records by summing all last_bad_count in
   * each Harvest
   *
   * @return {number}
   */
  badRecordCount() {
    let count = 0;
    Harvests.find({last_bad_count: {$gt: 0} }).forEach((harvest) => {
      count += harvest.last_bad_count;
    });
    return count;
  },
});

/**
 * Subscribes to harvests.public
 */
Template.about.onCreated(function() {
  this.autorun(() => {
    this.subscribe('harvests.public');
  });
});

/*
 * currentHarvestsTable: helpers
 */
Template.currentHarvestsTable.helpers({
  /**
   * Returns a well formatted harvest type that is readable.
   *
   * @param {string} harvestType - The harvest_type attribute from the Harvests
   *     collection.
   * @return {string}
   */
  parseHarvestType(harvestType) {
    if (harvestType === 'CSW') {
      return 'CS-W';
    }
    return harvestType;
  },
});
