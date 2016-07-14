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

function validatedRender(callback){
  if(!Meteor.userId()) {
    return FlowRouter.go('login');
  }

  Meteor.call('isValidUser', Meteor.userId(), (error, response) => {
    if(error) {
      FlashMessages.sendError(error.reason);
      FlowRouter.go('login');
    } else {
      callback(null, response);
    }
  });
}


FlowRouter.route('/harvests', {
  name: 'harvests',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "harvests"});
    });
  }
});



FlowRouter.route('/harvests/:harvestId/edit', {
  name: 'harvestsEdit',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "harvestsEdit"});
    });
  }
});


FlowRouter.route('/users', {
  name: 'users',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        return FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "users"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        return FlowRouter.go('harvests');
      }
    });
  }
});


FlowRouter.route('/users/new', {
  name: 'usersNew',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "usersNew"});
  }
});

FlowRouter.route('/users/verify/:token', {
  name: 'usersVerify',
  action(params) {
    Accounts.verifyEmail(params.token, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        return FlowRouter.go('login');
      } else {
        FlashMessages.sendSuccess("Thank you! Your email has now been verified!");
        return FlowRouter.go('harvests');
      }
    });
  }
});
