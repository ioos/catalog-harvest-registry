import './harvests.jade';
import './harvests.less';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';

/*****************************************************************************/
/* harvests: Event Handlers */
/*****************************************************************************/
Template.harvests.events({
  'click tr'() {
    const instance = Template.instance();
    harvests = instance.state.get('harvests');
    harvests = _.map(harvests, function(harvest) {
      harvest.active = false;
      if(harvest._id == this._id) {
        harvest.active = true;
      }
      return harvest;
    }, this);
    instance.state.set('harvests', harvests);
  }
});

/*****************************************************************************/
/* harvests: Helpers */
/*****************************************************************************/
Template.harvests.helpers({
  harvests: function() {
    const instance = Template.instance();
    return instance.state.get('harvests');
  },
  activeHarvest: function() {
    const instance = Template.instance();
    harvests = instance.state.get('harvests');
    return _.findWhere(harvests, {active: true});
  }
});

/*****************************************************************************/
/* harvests: Lifecycle Hooks */
/*****************************************************************************/
Template.harvests.onCreated(function() {
  this.state = new ReactiveDict();
  this.state.set('harvests', [
    {
      _id: 1,
      name: "THREDDS WAF",
      organization: "MARACOOS",
      url: "http://sos.maracoos.org/maracoos-iso/",
      type: "WAF",
      active: true
    },
    {
      _id: 2,
      name: "SOS WAF",
      organization: "MARACOOS",
      url: "http://sos.maracoos.org/maracoos-iso/",
      type: "WAF",
      active: false
    },
    {
      _id: 3,
      name: "GLOS CSW",
      organization: "MARACOOS",
      url: "http://sos.maracoos.org/maracoos-iso/",
      type: "WAF",
      active: false
    },

  ]);
});

Template.harvests.onRendered(() => {
});

Template.harvests.onDestroyed(() => {
});
