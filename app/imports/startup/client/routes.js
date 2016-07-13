import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

import './templates.js';

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
