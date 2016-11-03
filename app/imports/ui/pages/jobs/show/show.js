import './show.jade';
import './show.less';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { moment } from 'meteor/momentjs:moment';
import { Organizations } from '/imports/api/organizations/organizations.js';

/*****************************************************************************/
/* show: Event Handlers */
/*****************************************************************************/
Template.showJobs.events({
});

/*****************************************************************************/
/* showJobs: Helpers */
/*****************************************************************************/
Template.showJobs.helpers({
  report() {
    return Template.instance().state.get('report');
  },
  loadingError() {
    return Template.instance().state.get('error') !== null;
  },
  error() {
    return Template.instance().state.get('error');
  },
  loading() {
    return Template.instance().state.get('report') === null;
  }
});

/*****************************************************************************/
/* showJobs: Lifecycle Hooks */
/*****************************************************************************/
Template.showJobs.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('report', null);
  this.state.set('error', null);
  let organization = FlowRouter.getParam('organization');
  this.autorun(() => {
    this.subscribe('organizations');
    Meteor.call('jobs.get', organization, (error, response) => {
      if(response) {
        this.state.set("report", response);
      } else if(error.error == 404) {
        this.state.set("error", "No CKAN Harvest Located");
      } else if(error.message) {
        this.state.set("error", error.message);
      } else {
        console.error(error);
      }
    });
  });
});

Template.showJobs.onRendered(function() {
});

Template.showJobs.onDestroyed(function() {
});

Template.jobReport.helpers({
  organization() {
    return Organizations.findOne({name: FlowRouter.getParam('organization')});
  },
  jobErrors() {
    return _.map(this.report.report.result.object_errors, (value, key) => {return value;});
  },
  finished() {
    if(this.report.finished) {
      return moment.utc(this.report.finished).fromNow();
    }
    return "";
  }
});

Template.documentError.helpers({
  errorMessage() {
    if(this.type == "Validation") {
      return "(" + this.type + ") Line " + this.line + " " + this.message;
    }
    return "(" + this.type + ") " + this.message;
  }
});
