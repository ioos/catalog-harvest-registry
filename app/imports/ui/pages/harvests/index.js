import './index.html';
import './index.less';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Harvests } from '/imports/api/harvests/harvests.js';

Template.harvestsIndex.onCreated(function() {
  this.autorun(() => {
    Harvests.read(null, (error, response) => {
      if(error) {
        Session.set('harvests', {error});
      } else {
        Session.set('harvests', response);
      }
    });
  });
});

Template.harvestsIndex.helpers({
  harvests() {
    return Session.get('harvests');
  }
});

Template.harvestsIndex.events({
  'click tr'(event) {
    FlowRouter.go('Harvests.show', {harvestId: this.id});
  }
});
