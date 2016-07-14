import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlashMessages } from 'meteor/mrt:flash-messages';

import './templates.js';

FlashMessages.configure({
  autoHide: true
});

FlowRouter.route('/', {
  name: 'login',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "loginForm"});
  },
});


FlowRouter.route('/harvests', {
  name: 'harvests',
  action() {
    if(Meteor.userId()) {
      BlazeLayout.render('MasterLayout', {yield: "harvests"});
    } else {
      FlowRouter.go('login');
    }
  }
});



FlowRouter.route('/harvests/:harvestId/edit', {
  name: 'harvestsEdit',
  action() {
    if(Meteor.userId()) {
      BlazeLayout.render('MasterLayout', {yield: "harvestsEdit"});
    } else {
      FlowRouter.go('login');
    }
  }
});


FlowRouter.route('/users', {
  name: 'users',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "users"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        FlowRouter.go('harvests');
      }
    });
  }
});
