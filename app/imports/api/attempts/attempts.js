import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Attempts = new Mongo.Collection('Attempts');

const FailureDetails = new SimpleSchema({
    code: {type: Number},
    message: {type: String, optional: true }
});

const AttemptsSchema = new SimpleSchema({
  'parent_harvest': { type: String, regEx: SimpleSchema.RegEx.Id },
  'date': { type: Date },
  'successful': { type: Boolean },
  'num_records': { type: Number, optional: true },
  'failure': { type: FailureDetails, optional: true }
});

Attempts.schema = AttemptsSchema;
Attempts.attachSchema(AttemptsSchema);
