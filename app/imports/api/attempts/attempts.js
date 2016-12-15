/**
 * @module /imports/api/attempts/attempts
 */
import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

/**
 * Attempts represent the execution of a harvest job. It records information
 * about which harvest the job was for, if it was successful and how many
 * records were parsed. This collection is published using `attempts.public`
 * which returns all attempts.
 *
 * Example:
 *
 * ```
 * let attempts = Attempts.find({});
 * ```
 *
 * @public
 * 
 * @property {string} parent_harvest The identifier for the parent harvest
 * @property {Date} date Date of the attempt
 * @property {Boolean} successful Boolean whether the attempt succeeded
 * @property {Number} num_records Number of records parsed
 * @property {object} failure Details of the failure
 */
export const Attempts = new Mongo.Collection('Attempts');

/**
 * Details of a failure
 *
 * @property {Number} code The Status Code of the failure
 * @property {string} message The error message
 */
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
