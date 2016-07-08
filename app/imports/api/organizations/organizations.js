import { RestCollection } from '/imports/lib/postgrest/collection.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Organizations = new RestCollection("http://localhost:3100", "organizations");

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
