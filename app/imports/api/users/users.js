import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

// Meteor already has a collection called users, we just wrap that in a
// collection for clients to reactively observe changes.
//
// If we didn't want the reactive changes, we could just use methods by
// themselves, but since we like reactivity, we'll take advantage of the
// client's minimongo to track changes and allow views to subscribe to those
// changes.
//


export const UserSchema = new SimpleSchema({
  email: {
    label: "Email",
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  name: {
    label: "Full Name",
    type: String
  },
  organization: {
    label: "Organization",
    type: [String]
  },
  poc_name: {
    label: "IOOS Organization POC",
    type: String
  },
  poc_email: {
    label: "IOOS Organization POC Email",
    type: String,
    regEx: SimpleSchema.RegEx.Email
  },
  password: {
    label: "Password",
    type: String,
    min: 8,
  }
});

if(Meteor.isClient) {
  export const Users = new Meteor.Collection('reactiveUsers');
}
