import './banner.jade';
import './banner.less';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Roles } from 'meteor/alanning:roles';


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
  pathTo(route) {
    return FlowRouter.path(route);
  },
  isLoggedIn() {
    return Boolean(Meteor.userId());
  },
  isAdmin() {
    let userId = Meteor.userId();
    if(!userId) {
      return false;
    }
    return Roles.userIsInRole(userId, ['admin']);
  }
});

