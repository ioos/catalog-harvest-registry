import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Tabular } from 'meteor/aldeed:tabular';
import { Template } from 'meteor/templating';

export const Records = new Mongo.Collection('Records');

export const RecordsTable = new Tabular.Table({
  name: "Records",
  collection: Records,
  columns: [
    {
      title: "Title",
      data: "title",
      tmpl: Meteor.isClient && Template.recordsTitle
    },
    {
      title: "Description",
      data: "description",
      tmpl: Meteor.isClient && Template.recordsDescription
    },
    {
      title: "<span title='List of Available Services in the Document'>Services</span>",
      data: "services",
      tmpl: Meteor.isClient && Template.recordsServicesCell
    },
    {
      title: "<span title='Validation or Parsing Errors in the Documents'>Errors</span>",
      data: "validation_errors",
      tmpl: Meteor.isClient && Template.recordsErrorCell
    },
    {
      title: "<span title='Link to the original document'>XML Source</span>",
      data: "url",
      tmpl: Meteor.isClient && Template.recordsLink
    },
    {
      title: "<span title='Link to the record in the central WAF'>XML Published</span>",
      data: "record_url",
      tmpl: Meteor.isClient && Template.recordsWAFLink
    },
    {
      title: "<span title='Identifies when the resource was issued and made publicly available.'>Metadata Date</span>",
      data: "metadata_date"
    },
    {
      title: "<span title='There was an error processing this record'>CKAN</span>",
      tmpl: Meteor.isClient && Template.recordsCKANLink
    }
  ],
  extraFields: ['file_id'],
  search: {
    onEnterOnly: true
  }
});
