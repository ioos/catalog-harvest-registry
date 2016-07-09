import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/pages/harvests/index.js';
import '/imports/ui/pages/harvests/show.js';
import '/imports/ui/pages/harvests/edit.js';
import '/imports/ui/pages/organizations/index.js';
import '/imports/ui/pages/organizations/edit.js';
import '/imports/ui/layouts/app-body.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body');
  },
});

// the App_notFound template is used for unknown routes
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};

FlowRouter.route('/harvests', {
  name: 'Harvests.index',
  action() {
    BlazeLayout.render('App_body', { main: 'harvestsIndex' });
  }
});

FlowRouter.route('/harvests/:harvestId', {
  name: 'Harvests.show',
  action() {
    BlazeLayout.render('App_body', { main: 'harvestsShow' });
  }
});

FlowRouter.route('/harvests/:harvestId/edit', { 
  name: 'Harvests.edit',
  action() {
    BlazeLayout.render('App_body', { main: 'harvestsEdit' });
  }
});

FlowRouter.route('/organizations', {
  name: 'Organizations.index',
  action() {
    BlazeLayout.render('App_body', { main: 'organizationsIndex' });
  }
});

FlowRouter.route('/organizations/:organizationId/edit', {
  name: 'Organizations.edit',
  action() {
    BlazeLayout.render('App_body', { main: 'organizationsEdit' });
  }
});
