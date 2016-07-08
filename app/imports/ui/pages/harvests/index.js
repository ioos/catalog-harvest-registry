import './index.html';
import './index.less';

import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

Template.harvestsIndex.onCreated(function() {
  this.autorun(() => {
    Meteor.call('harvests.read', (err, response) => {
      if(err) {
        Session.set('harvests', {error: err});
      } else {
        Session.set('harvests', response);
        return response;
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
    console.log(this);
  }
});
