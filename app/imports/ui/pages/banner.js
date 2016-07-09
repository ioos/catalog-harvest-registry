import './banner.html';
import './banner.less';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.App_banner.helpers({
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  }
});

