import './new.html';

import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { AutoForm } from 'meteor/aldeed:autoform';
import { _ } from 'meteor/underscore';

Template.harvestNew.helpers({
  formSchema() {
    return Harvests.simpleSchema().pick(Harvests.formFields);
  }
});
