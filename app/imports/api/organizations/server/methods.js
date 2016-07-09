import '/imports/lib/postgrest/server/collection.js';
import { Organizations } from '../organizations.js';
import { Meteor } from 'meteor/meteor';

// The server should know about the service
Organizations._api = Meteor.settings.services.postgrest.url;

// Register the Meteor methods
Organizations.register();
