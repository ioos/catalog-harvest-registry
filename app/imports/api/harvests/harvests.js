import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Harvests = {
  schema: new SimpleSchema({
    id: {
      type: Number
    },
    url: {
      type: String
    },
    harvest_interval: {
      type: String
    },
    enabled: {
      type: Boolean
    },
    organization_name: {
      type: String
    }
  })
};


