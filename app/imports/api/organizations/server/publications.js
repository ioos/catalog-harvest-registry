/**
 * Publications are highly app specific and as such Maka doesn't try
 * to implement any logic out of the box.  This file is simply to
 * provide a friendly reminder that you MAY need to have publications.
 */
import { Meteor } from 'meteor/meteor';
import { Organizations } from '../organizations.js';

Meteor.publish('organizations', function organizationsPublic() {
      return Organizations.find({});
});

