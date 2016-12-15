/**
 * @module /imports/api/startup/client/routes
 */
import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { FlashMessages } from 'meteor/mrt:flash-messages';

import './templates.js';


/**
 * A helper function that will check if a user is logged in. If the user is not
 * logged in the page is routed to the login page. Otherwise the callback is
 * executed.
 *
 * @param {function} callback A function that accepts two arguments `(error, response)`.
 */
const validatedRender = function(callback) {
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
};


FlashMessages.configure({
  autoHide: true,
  autoScroll: false
});


/**
 * This is the main route that is rendered if the user is not logged in.
 * @name login
 */
FlowRouter.route('/', {
  name: 'login',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "loginForm"});
  },
});

/****************************************/
/* Harvests */
/****************************************/

/**
 * `/harvests`
 *
 * This route renders a page consisting of a table of harvests, a chart of
 * statistics and a small dashboard heading. The route may optionally accept a
 * harvest identifier.
 *
 * @name harvests
 * @param {string} harvestId Identifier for harvest collection
 */
FlowRouter.route('/harvests', {
  name: 'harvests',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "harvests"});
    });
  }
});


FlowRouter.route('/harvests/:harvestId', {
  name: 'harvests',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "harvests"});
    });
  }
});

/****************************************/
/* Users */
/****************************************/

/**
 * `/users`
 *
 * This route renders a page with a table of users for admins to view and
 * modify accounts. The router will check if a user is an administrator, and
 * will reroute to the default page if the user is not an administrator.
 *
 * **ADMIN ONLY**
 * @name users
 */
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


/**
 * `/users/new`
 *
 * This route renders a form for new user registration. All visitors can view
 * this page.
 * @name usersNew
 */
FlowRouter.route('/users/new', {
  name: 'usersNew',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "usersNew"});
  }
});


/**
 * `/users/verify/:token`
 *
 * This route is a sort of callback that users visit after receiving the URL in
 * an email to verify that the email belongs to a user. Visiting this route
 * will cause the user's account to become verified.
 *
 * @name usersVerify
 */
FlowRouter.route('/users/verify/:token', {
  name: 'usersVerify',
  action(params) {
    Accounts.verifyEmail(params.token, (error, response) => {
      if(error) {
        FlashMessages.sendError(error.reason);
        return FlowRouter.go('login');
      } else {
        FlashMessages.sendSuccess("Thank you! Your email has now been verified!");
        return FlowRouter.go('login');
      }
    });
  }
});


/**
 * `/users/edit`
 *
 * This route allows a user to modify his/her account
 * @name usersEdit
 */
FlowRouter.route('/users/edit', {
  name: 'usersEdit',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "usersEdit"});
    });
  }
});


/**
 * `/users/reset/:token`
 *
 * This route is used to allow users to reset their passwords.
 * @name usersReset
 */
FlowRouter.route('/users/reset/:token', {
  name: 'usersReset',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "usersReset"});
  }
});


/**
 * `/users/org/edit/:userId`
 *
 * This route renders a page that allows an administrator to modify a user's
 * organizations.
 *
 * @name usersOrgEdit
 */
FlowRouter.route('/users/org/edit/:userId', {
  name: 'usersOrgEdit',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        return FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "usersOrgEdit"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        return FlowRouter.go('harvests');
      }
    });
  }
});

/****************************************/
/* Organizations */
/****************************************/

/**
 * `/organizations`
 *
 * This route renders a page with a listing of all organizations and links to
 * edit them.
 *
 * @name organizations
 */
FlowRouter.route('/organizations', {
  name: 'organizations',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        return FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "organizations"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        return FlowRouter.go('harvests');
      }
    });
  }
});


/**
 * `/organizations/new`
 *
 * This route renders a form for creating a new Organization
 * @name newOrganization
 */
FlowRouter.route('/organizations/new', {
  name: 'newOrganization',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        return FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "newOrganization"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        return FlowRouter.go('harvests');
      }
    });
  }
});


/**
 * `/organizations/:organizationId/edit`
 * 
 * This route renders a form for editing an existing Organization
 *
 * @name editOrganization
 */
FlowRouter.route('/organizations/:organizationId/edit', {
  name: 'editOrganization',
  action() {
    Meteor.call("userIsInRole", Meteor.userId(), "admin", (error, isAdmin) => {
      if(error) {
        return FlowRouter.go('login');
      }
      if(isAdmin) {
        BlazeLayout.render('MasterLayout', {yield: "editOrganization"});
      } else {
        FlashMessages.sendError("You are not authorized to view this page.");
        return FlowRouter.go('harvests');
      }
    });
  }
});

/****************************************/
/* Records */
/****************************************/

/**
 * `/records/:harvestId`
 *
 * This route renders a table listing all the records for a given Harvest
 *
 * @name records
 */
FlowRouter.route('/records/:harvestId', {
  name: 'records',
  action() {
    validatedRender((error, response) => {
        BlazeLayout.render('MasterLayout', {yield: "records"});
    });
  }
});

/****************************************/
/* About */
/****************************************/

/**
 * `/about`
 *
 * This route renders a simple about page. Any visitor can access this route.
 *
 * @name about
 */
FlowRouter.route('/about', {
  name: 'about',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "about"});
  }
});

/****************************************/
/* Jobs */
/****************************************/

/**
 * This route renders a page detailing the CKAN Job details for a given organization's CKAN harvester.
 *
 * @name showJobs
 */
FlowRouter.route('/jobs/show/:organization', {
  name: 'showJobs',
  action() {
    validatedRender((error, response) => {
      BlazeLayout.render('MasterLayout', {yield: "showJobs"});
    });
  }
});
