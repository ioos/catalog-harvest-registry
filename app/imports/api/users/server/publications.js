import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

Meteor.publish('reactiveUsers', function() {
  if(!Roles.userIsInRole(this.userId, "admin")) {
    throw new Meteor.Error(401, "Unauthorized");
  }
  let handle = Meteor.users.find({}, {fields: {emails: 1, profile: 1, roles: 1}}).observeChanges({
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

  this.ready();
  this.onStop(() => {
    handle.stop();
  });
});

