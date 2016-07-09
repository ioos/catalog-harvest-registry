import { RestCollection } from '/imports/lib/postgrest/collection.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';

// Since this is a backend service the client shouldn't know anything about the service.
export const Organizations = new RestCollection(null, "organizations");

Organizations.schema = new SimpleSchema({
  id: {
    type: Number,
    label: "ID"
  },
  name: {
    type: String,
  },
  description: {
    type: String
  },
  contact_url: {
    type: String
  }
});

Organizations.attachSchema(Organizations.schema);

Organizations.formFields = [
  "name",
  "description",
  "contact_url"
];
