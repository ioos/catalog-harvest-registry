import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Records = new Mongo.Collection('Records');

const ServicesSchema = new SimpleSchema({
    name: { type: String },
    endpoint_url: { type: String, regEx: SimpleSchema.RegEx.Url },
    endpoint_type: { type: String }
});


const RecordsSchema = new SimpleSchema({
    parent_attempt: { type: String, regEx: SimpleSchema.RegEx.Id },
    title: { type: String },
    summary: { type: String, optional: true },
    services: { type: [ServicesSchema]}
});

Records.schema = RecordsSchema;
Records.attachSchema(RecordsSchema);
