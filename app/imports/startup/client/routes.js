import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/pages/harvests/new.js';
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

FlowRouter.route('/harvests/new', {
  name: 'Harvests.new',
  action() {
    BlazeLayout.render('App_body', { main: 'harvestNew' });
  },
});