import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const Organizations = new Mongo.Collection('Organizations');

Organizations.schema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String,
    optional: true
  },
  url: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "URL",
  },
  logo_url: {
    type: String,
    optional: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "URL to Organization Logo"
  }
});

Organizations.attachSchema(Organizations.schema);

if (Meteor.isClient) {
  Organizations.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    }
  });

  Organizations.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    }
  });
}
