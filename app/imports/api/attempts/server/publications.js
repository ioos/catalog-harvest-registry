import { Meteor } from 'meteor/meteor';
import { Attempts } from '../attempts.js';


Meteor.publish('attempts.public', function attemptsPublic() {
  return Attempts.find({});
});
