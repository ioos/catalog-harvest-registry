/**
 * @module /imports/api/organizations/organizations
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


/**
 * Organizations represent an institution or group that acts as a data provider
 * for submitting ISO-19115 Documents to the IOOS Catalog.
 *
 * This collection is published on `organizations`
 *
 * @public
 *
 * @property {string} name Name of the Organization
 * @property {string} description A brief summary or description of the Organization
 * @property {string} url The URL to the homepage of the Organization
 * @property {string} logo_url The URL to the Organization's logo
 * @property {string} ckan_harvest_url The URL to the CKAN Harvest page.
 */
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
    regEx: /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/,
    label: "URL",
  },
  logo_url: {
    type: String,
    optional: true,
    regEx: /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/,
    label: "URL to Organization Logo"
  },
  ckan_harvest_url: {
    type: String,
    optional: true,
    regEx: /(https?|ftp):\/\/[^\s/$.?#].[^\s]*/,
    label: "URL to the CKAN Harvest"
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
