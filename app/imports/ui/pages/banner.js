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

Template.registerHelper('absoluteUrl', (path) => {
    return Meteor.absoluteUrl(path);
});

Template.registerHelper('pathTo', (route) => {
    return FlowRouter.path(route);
});

Template.registerHelper('isLoggedIn', () => {
    return Boolean(Meteor.userId());
});

Template.registerHelper('isAdmin', () => {
    let userId = Meteor.userId();
    if(!userId) {
      return false;
    }
    return Roles.userIsInRole(userId, ['admin']);
});
