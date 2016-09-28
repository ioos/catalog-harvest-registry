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
      render: function(val, type, doc) {
        val = val || "No title provided";
        if(val && val.length > 40) {
          val = val.substr(0, 40) + "...";
        }
        return val;
      }
    },
    {
      title: "Description",
      data: "description",
      tmpl: Meteor.isClient && Template.recordsDescription
    },
    {
      title: "Services",
      data: "services",
      tmpl: Meteor.isClient && Template.recordsServicesCell
    },
    {
      title: "Errors",
      data: "validation_errors",
      tmpl: Meteor.isClient && Template.recordsErrorCell
    },
    {
      title: "XML Source",
      data: "url",
      tmpl: Meteor.isClient && Template.recordsLink
    },
    {
      title: "XML Published",
      data: "record_url",
      tmpl: Meteor.isClient && Template.recordsWAFLink
    },
    {
      title: "CKAN",
      tmpl: Meteor.isClient && Template.recordsCKANLink
    }
  ],
  extraFields: ['file_id']
});
