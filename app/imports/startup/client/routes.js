import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import './templates.js';

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "loginForm"});
  },
});


FlowRouter.route('/harvests', {
  name: 'harvests',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "harvests"});
  }
});

