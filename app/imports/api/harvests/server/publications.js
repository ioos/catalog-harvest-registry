/**
 * Publications are highly app specific and as such Maka doesn't try
 * to implement any logic out of the box.  This file is simply to
 * provide a friendly reminder that you MAY need to have publications.
 */


import { Meteor } from 'meteor/meteor';
import { Harvests } from '../harvests.js';

Meteor.publish('harvests.public', function harvestsPublic() {
  return Harvests.find({}, { fields: Harvests.publicFields });
});
