import './edit.jade';
import './edit.less';

import { Template } from 'meteor/templating';
import { AutoForm } from 'meteor/aldeed:autoform';
import { Organizations } from '/imports/api/organizations/organizations.js';

Template.organizationsEdit.onCreated(function() {
  this.autorun(() => {
    Organizations.read(FlowRouter.getParam("organizationId"), (error, response) => {
      if(error) {
        Session.set('organization', {error});
      } else if (response.length == 1) {
        Session.set('organization', response[0]);
      } else {
        Session.set('organization', {error: "Not Found"});
      }
    });
  });
});

Template.organizationsEdit.helpers({
  organization() {
    return Session.get('organization');
  },
  formSchema() {
    return Organizations.schema.pick(Organizations.formFields);
  },
  success() {
    return Session.get('success');
  }
});

AutoForm.hooks({
  editOrganization: {
    onSubmit: function(insertDoc, updateDoc, currentDoc) {
      var self = this;
      this.event.preventDefault();
      let doc = insertDoc;
      doc.id = Session.get('organization').id;
      Organizations.update(doc, function(error, response) {
        self.done(error, response);
      });

    },
    onSuccess: function(formType, result) {
      console.log(result);
      Session.set('success', true);
    },
    onError: function(formType, error) {
      console.error(error);
    }
  }
});
