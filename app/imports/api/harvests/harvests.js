import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
// ✅ import { SimpleSchema } from 'meteor/aldeed:simple-schema

class HarvestsCollection extends Mongo.Collection {
    // If you need to perform any custom actions on the data
    // before it's actually inserted, i.e. add a 'createdAt'
    // this -> HarvestsCollection
    // super -> Mongo.Collection
    //
    //  i.e.:
    //  this.find(selector);
    //  super.insert(doc);
    //
    insert(doc, callback) {
        return doc;
    }

    update(selector, callback) {
        return selector;
    }

    remove(selector) {
        return selector;
    }
}

export const Harvests = new Mongo.Collection('Harvests');

const HarvestSchema = new SimpleSchema({
  _id: {
    type: String
  },
  name: {
    type: String,
    optional: true
  },
  url: {
    type: String,
    unique: true,
    regEx: SimpleSchema.RegEx.Url,
    label: "URL"
  },
  org: {type: String,
        label: "Organization"},
  /* harvest interval in seconds.  Initialize to null to indicate no harvest
   * made */
  last_harvest_dt: {type: Date, optional: true},
  harvest_interval: {type: Number},
  harvest_type: {type: String, allowedValues: ['WAF', 'CSW']}
});
Harvests.schema = HarvestSchema;

// add public Fields
Harvests.publicFields = {
  _id: 1,
  name: 1,
  url: 1,
  org: 1,
  last_harvest_dt: 1,
  harvest_interval: 1,
  harvest_type: 1
};

Harvests.attachSchema(HarvestSchema);

if (Meteor.isClient) {
  Harvests.allow({
    insert(userId, doc) {
      return false;
    },

    update(userId, doc, fieldNames, modifier) {
      return false;
    },

    remove(userId, doc) {
      return false;
    }
  });

  Harvests.deny({
    insert(userId, doc) {
      return true;
    },

    update(userId, doc, fieldNames, modifier) {
      return true;
    },

    remove(userId, doc) {
      return true;
    }
  });
}
