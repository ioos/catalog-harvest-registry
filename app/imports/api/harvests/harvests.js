import { RestCollection } from '/imports/lib/postgrest/collection.js';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const Harvests = new RestCollection('http://localhost:3100', 'harvest_summary');


Harvests.schema = new SimpleSchema({
  id: {
    type: Number,
    label: "ID"
  },
  url: {
    type: String,
    label: "URL"
  },
  harvest_interval: {
    type: String,
    label: "Harvest Interval"
  },
  enabled: {
    type: Boolean
  },
  organization_name: {
    type: String,
    label: "Organization"
  }
});

Harvests.attachSchema(Harvests.schema);

Harvests.formFields = [
  "url",
  "harvest_interval",
  "enabled",
  "organization_name"
];
