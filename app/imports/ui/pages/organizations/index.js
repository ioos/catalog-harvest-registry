import './index.jade';
import './index.less';

import { Template } from 'meteor/templating';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.organizationsIndex.onCreated(function() {
  this.autorun(() => {
    Organizations.read(null, (err, response) => {
      if(err) {
        Session.set('organizations', {error: err});
      } else {
        Session.set('organizations', response);
        return response;
      }
    });
  });
});

Template.organizationsIndex.helpers({
  organizations() {
    return Session.get('organizations');
  }
});

Template.organizationsIndex.events({
  'click tr'(event) {
    FlowRouter.go('Organizations.edit', {organizationId: this.id});
  }
});
