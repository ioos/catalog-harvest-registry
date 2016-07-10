import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

import '/imports/ui/layouts/master-layout.js';

/* begin-template-imports */
/* end-template-imports */

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('MasterLayout', {yield: ""});
  },
});

