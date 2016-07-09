import './show.html';
import './show.less';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Fake } from 'meteor/anti:fake';
import { _ } from 'meteor/underscore';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { FlowRouter } from 'meteor/kadira:flow-router';

Template.harvestsShow.onCreated(function() {
  this.autorun(() => {
    Harvests.read(FlowRouter.getParam('harvestId'), (error, response) => {
      if(error) {
        Session.set('harvest', {error});
      } else if(response.length == 1) {
        Session.set('harvest', response[0]);
      } else {
        Session.set('harvest', {error: "Not Found"});
      }
    });
  });
});

Template.harvestsShow.helpers({
  absolutePath(path) {
    return Meteor.absoluteUrl(path);
  },
  fakeSentence() {
    return Fake.paragraph(4);
  },
  objectKey(obj) {
    return _.map(obj, function(value, key) {
      let label = Harvests.schema.label(key);
      return {label, value};
    });
  },
  harvest() {
    return Session.get('harvest');
  }
});

Template.harvestsShow.events({
  'click #back'() {
    FlowRouter.go('Harvests.index');
  }
});

