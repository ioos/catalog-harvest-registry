import './harvests-chart.jade';
import { Template } from 'meteor/templating';
import { Harvests } from '/imports/api/harvests/harvests.js';
import { nv } from 'meteor/nvd3:nvd3';

/*****************************************************************************/
/* harvestsChart: Event Handlers */
/*****************************************************************************/
Template.harvestsChart.events({
});

/*****************************************************************************/
/* harvestsChart: Helpers */
/*****************************************************************************/
Template.harvestsChart.helpers({
  activeHarvest: function() {
    let instance = Template.instance();
    return instance.state.get('doc');
  }
});

/*****************************************************************************/
/* harvestsChart: Lifecycle Hooks */
/*****************************************************************************/

var addDonutChart = function(selector, data) {
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

      d3.select(selector)
          .datum(data())
          .transition().duration(350)
          .call(chart);

    return chart;
  });
};


Template.harvestsChart.onCreated(function() {
});


Template.harvestsChart.renderChart = function() {
  addDonutChart("#chart svg", () => {
    return  [
        { 
          "label": "Good",
          "value" : Math.floor(Math.random() * 10)
        } , 
        { 
          "label": "Errors",
          "value" : Math.floor(Math.random() * 10)
        }
      ];
  });
};

Template.harvestsChart.onRendered(function() {
  if(this.state.get('doc') !== null) {
    Template.harvestsChart.renderChart();
  }
});

Template.harvestsChart.onDestroyed(function() {
});
