/**
 * @module /imports/api/jobs/methods
 */

/*
 * Methods for accessing data from the CKAN Harvest Job Interface
 */

import { Meteor } from 'meteor/meteor';
import { ValidatedMethod, ValidationError } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';
import { Organizations } from '../organizations/organizations.js';
import urljoin from 'url-join';


/**
 * A Job represents the latest CKAN Harvest Status. Since this is retrieved
 * using an API, there is no MongoDB collection, and no publications.
 *
 * ```
 * {
 *     "created": "2016-09-30 13:36:03.859280",
 *     "finished": "2016-09-30 13:36:04.223254",
 *     "gather_error_summary": [],
 *     "gather_finished": "2016-09-30 13:36:03.978278",
 *     "gather_started": "2016-09-30 13:36:03.918002",
 *     "id": "9f2a02f3-1562-4766-9d91-aa2cbfe68c93",
 *     "object_error_summary": [
 *         {
 *             "error_count": 4,
 *             "message": "Element '{http://www.isotc211.org/2005/gco}Measure': '' is not a valid value of the atomic type 'xs:double'."
 *         }
 *     ],
 *     "report": {
 *         "help": "http://159b79a84c0d/api/3/action/help_show?name=harvest_job_report",
 *         "result": {
 *             "gather_errors": [],
 *             "object_errors": {
 *                 "31894581-e0b8-4151-9c22-8b943f71d86c": {
 *                     "errors": [
 *                         {
 *                             "line": 103,
 *                             "message": "Element '{http://www.isotc211.org/2005/gco}Measure': '' is not a valid value of the atomic type 'xs:double'.",
 *                             "type": "Validation"
 *                         }
 *                     ],
 *                     "guid": "cbf5e2aacaa0a8ecf35c15dafd444bcd",
 *                     "original_url": "http://192.168.99.100:3001/GCOOS/CONUS_12km_2012_TwoD.xml"
 *                 },
 *                 "a1c5468e-f858-467b-833d-13cb8b6f6b22": {
 *                     "errors": [
 *                         {
 *                             "line": 103,
 *                             "message": "Element '{http://www.isotc211.org/2005/gco}Measure': '' is not a valid value of the atomic type 'xs:double'.",
 *                             "type": "Validation"
 *                         }
 *                     ],
 *                     "guid": "9c1462c8f960e643437c8e5f40d7d847",
 *                     "original_url": "http://192.168.99.100:3001/GCOOS/CONUS_12km_2013_TwoD.xml"
 *                 },
 *                 "a2a755f7-5ea5-4fb0-810e-ae6a9bd4ea9d": {
 *                     "errors": [
 *                         {
 *                             "line": 103,
 *                             "message": "Element '{http://www.isotc211.org/2005/gco}Measure': '' is not a valid value of the atomic type 'xs:double'.",
 *                             "type": "Validation"
 *                         }
 *                     ],
 *                     "guid": "ea99f90649876189dbdf690c508f91cc",
 *                     "original_url": "http://192.168.99.100:3001/GCOOS/CONUS_12km_2013_Best.xml"
 *                 },
 *                 "e6f789a5-00be-41dc-954c-51b23670c3a1": {
 *                     "errors": [
 *                         {
 *                             "line": 103,
 *                             "message": "Element '{http://www.isotc211.org/2005/gco}Measure': '' is not a valid value of the atomic type 'xs:double'.",
 *                             "type": "Validation"
 *                         }
 *                     ],
 *                     "guid": "2887aa1c7a9a340ff816637e78a1f129",
 *                     "original_url": "http://192.168.99.100:3001/GCOOS/CONUS_12km_2012_Best.xml"
 *                 }
 *             }
 *         },
 *         "success": true
 *     },
 *     "source_id": "d80ab373-5793-49f3-aa17-f53727d1ccdc",
 *     "stats": {
 *         "added": 0,
 *         "deleted": 0,
 *         "errored": 4,
 *         "not modified": 0,
 *         "updated": 0
 *     },
 *     "status": "Finished"
 * }
 *  
 * ```
 *
 * @name Job
 *
 * @public
 */

/**
 * Helper method to make an HTTP request to the `harvest_job_report` CKAN API endpoint.
 *
 * @param {object} job The `last_job` object returned from the `harvest_source_show` API response.
 * @param {function} callback A callback that accepts `(error, response)` that
 * is executed when the HTTP request completes.
 */
const getJobReport = function(job, callback) {
  let apiURL = urljoin(Meteor.settings.services.ckan_api_url, "action", "harvest_job_report");
  let apiKey = Meteor.settings.services.ckan_api_key;
  let errorCode;
  let errorMessage;
  let myError;
  try {
    let response = HTTP.get(apiURL, {
                              headers: {"Authorization": apiKey},
                              params: {id: job.id}});
    job.report = response.data;
    callback(null, job);
  } catch(error) {
    if(error.response) {
      errorCode = error.response.data.code;
      errorMessage = error.response.data.message;
    } else {
      errorCode = 500;
      errorMessage = "Cannot Access API";
    }
    myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);
  }
};

/**
 * Helper method to make an HTTP request to the `harvest_source_show` CKAN API endpoint.
 *
 * @param {string} ckanHarvestId The Harvest identifier for a CKAN Harvest
 * @param {function} callback A callback that accepts `(error, response)` that
 * is called when the HTTP request complets.
 */
const getHarvest = function(ckanHarvestId, callback) {
  let apiURL = urljoin(Meteor.settings.services.ckan_api_url, "action", "harvest_source_show");
  let errorCode;
  let errorMessage;
  let myError;
  try {

    let response = HTTP.get(apiURL, 
                            {params: {id: ckanHarvestId}});
    let lastJob = response.data.result.status.last_job;

    if(lastJob) {
      getJobReport(lastJob, callback);
    } else {
      throw new Meteor.Error(400, "CKAN has never harvested this WAF before");
    }
  } catch (error) {
    if(error.errorType == "Meteor.Error") {
      callback(error, null);
      return;
    }
    if(error.response) {
      errorCode = error.response.statusCode;
      errorMessage = error.response.data.error.message;
    } else {
      errorCode = 500;
      errorMessage = "Cannot Access API";
    }
    myError = new Meteor.Error(errorCode, errorMessage);
    callback(myError, null);

  }
};

/**
 * An asynchronous Meteor Method that returns the latest Job for a CKAN
 * Harvest. The CKAN Harvest is the name of harvest, which is parsed from the
 * Organization's `ckan_harvest_url` attribute.
 *
 * Example:
 * ```
 * Meteor.call("jobs.get", organizationName, (error, response) => {
 *   ...
 * });
 * ```
 *
 * @function getJobs
 *
 * @param {string} organization Name of the organization
 */
export const getJobs = new ValidatedMethod({
  name: 'jobs.get',
  validate: null,
  run(organization) {
    let org = Organizations.findOne({name: organization});
    if(!org) {
      throw new Meteor.Error(404, "Not Found");
    }
    if(!org.ckan_harvest_url) {
      throw new Meteor.Error(400, "No CKAN Harvest Configured");
    }

    let urlTokens = org.ckan_harvest_url.split("/");
    let ckanHarvestId = urlTokens[urlTokens.length - 1];
    let response = Meteor.wrapAsync(getHarvest)(ckanHarvestId);
    return response;
  }
});

/*
if (Meteor.isServer) {
  // Only allow 5 list operations per connection per second.
  DDPRateLimiter.addRule({
    name(name) {
      return _.contains(RATE_LIMITED_METHODS, name);
    },

    // Rate limit per connection ID.
    connectionId() { return true; },
  }, 5, 1000);
}
*/
