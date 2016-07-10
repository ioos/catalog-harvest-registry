import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/master-layout.js';

/* begin-template-imports */
import '/imports/ui/templates/components/login-form.js';
/* end-template-imports */

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('MasterLayout', {yield: "loginForm"});
  },
});
