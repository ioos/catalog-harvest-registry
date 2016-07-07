import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Harvests = new Mongo.Collection('Harvests');

Harvests.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Harvests.schema = new SimpleSchema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  url: {
    type: String
  },
  type: {
    type: String,
    allowedValues: ['WAF', 'CSW']
  },
  organization: {
    type: String,
    allowedValues: ['IOOS']
  },
  createdAt: {
    type: Date,
    denyUpdate: true,
  },
});

// These are the required form fields used in conjunction with AutoForm and the
// insert validation
Harvests.formFields = [
  'name',
  'description',
  'url',
  'type',
  'organization'
];

// Required fields and will be used for validation
Harvests.attachSchema(Harvests.schema.pick([
  'name',
  'description',
  'url',
  'type',
  'organization',
  'createdAt'
]));
