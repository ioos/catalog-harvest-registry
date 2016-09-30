import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('reactiveUsers', function() {
  let handle = null;

  if(!Roles.userIsInRole(this.userId, "admin")) {
    handle = Meteor.users.find({_id: this.userId}, {fields: {emails: 1, profile: 1, roles: 1}}).observeChanges({
      changed: (id, fields) => {
        this.changed('reactiveUsers', id, fields);
      }
    });
  } else {
    handle = Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}}).observeChanges({
      added: (id, fields) => {
        this.added('reactiveUsers', id, fields);
      },
      changed: (id, fields) => {
        this.changed('reactiveUsers', id, fields);
      },
      removed: (id) => {
        this.removed('reactiveUsers', id);
      }
    });
  }

  this.ready();
  this.onStop(() => {
    handle.stop();
  });
});

