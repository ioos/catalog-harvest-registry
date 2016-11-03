/*
 * Methods for accessing data from the CKAN Harvest Job Interface
 */

import { Meteor } from 'meteor/meteor';
import { ValidatedMethod, ValidationError } from 'meteor/mdg:validated-method';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';
import { _ } from 'meteor/underscore';
import { Organizations } from '../organizations/organizations.js';
import urljoin from 'url-join';

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
