import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { HTTP } from 'meteor/http';
import { Harvests } from '/imports/api/harvests/harvests.js';
import './about.jade';
import './about.less';

/**
 * Fetches the CKAN Dataset Count and updates the state of the calling
 * template. Note: this function needs to be called using `call` or bound using
 * `bind`.
 */
const fetchCkanCount = function() {
  const ckanAPI = Meteor.settings.public.ckan_api_url;
  const ckanURL = `${ckanAPI}action/package_search?rows=0`;
  HTTP.get(ckanURL, {}, (error, result) => {
    if (!error) {
      if (result && result.data && result.data.result) {
        this.state.set('ckan_count', result.data.result.count);
      }
    }
  });
};

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
  /**
   * Returns the total number of records in CKAN. The count is null if the
   * value hasn't been fetched from CKAN yet.
   *
   * @return {?number}
   */
  ckanCount() {
    return Template.instance().state.get('ckan_count');
  },
});

/**
 * Subscribes to harvests.public and fetches the CKAN count
 */
Template.about.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('ckan_count', null);
  this.autorun(() => {
    this.subscribe('harvests.public');
  });
  fetchCkanCount.call(this);
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
