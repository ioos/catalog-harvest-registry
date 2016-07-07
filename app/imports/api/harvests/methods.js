import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Harvests } from './harvests.js';

export const insert = new ValidatedMethod({
  name: 'harvests.insert',
  validate: Harvests.simpleSchema().pick(Harvests.formFields).validator({clean: true, filter: false}),
  run({name, description, url, type, organization}) {
    const harvest = {
      name,
      description,
      url,
      type,
      organization,
      createdAt: new Date()
    };

    Harvests.insert(harvest);
  }
});

