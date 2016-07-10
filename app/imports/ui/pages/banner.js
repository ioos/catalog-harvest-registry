import './banner.jade';
import './banner.less';

import { Template } from 'meteor/templating';
import { Meteor } from 'meteor/meteor';

Template.MainBanner.helpers({
  absoluteUrl(path) {
    return Meteor.absoluteUrl(path);
  }
});

