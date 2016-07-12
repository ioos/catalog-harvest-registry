import './harvests.jade';
import './harvests.less';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { _ } from 'meteor/underscore';
import { nv } from 'meteor/nvd3:nvd3';

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
var exampleData = function() {
  return  [
      { 
        "label": "Good",
        "value" : 20
      } , 
      { 
        "label": "Errors",
        "value" : 5
      }
    ];
};

var addDonutChart = function() {
  //Donut chart example
  nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label; })
        .y(function(d) { return d.value; })
        .showLabels(true)     //Display pie labels
        .labelThreshold(0.05)  //Configure the minimum slice size for labels to show up
        .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
        .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
        .donutRatio(0.35)     //Configure how big you want the donut hole size to be.
        ;

      d3.select("#chart svg")
          .datum(exampleData())
          .transition().duration(350)
          .call(chart);

    return chart;
  });
};

Template.harvests.onRendered(() => {
  addDonutChart();
  $('.row.box-header .box').hover(function() {
    $(this).toggleClass('box-hover');
  });

});

Template.harvests.onDestroyed(() => {
});
