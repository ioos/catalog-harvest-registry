import './banner.jade';
import './banner.less';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';


Template.MainBanner.events({
  'click #logout'() {
    Meteor.logout(function() {
      FlowRouter.go('login');
    });
  }
});

Template.MainBanner.helpers({
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  },
  isLoggedIn() {
    return Boolean(Meteor.userId());
  }
});

