<template>
  <div class="rhythm-container">
    <div :id="chartId" style="height: 100%; width: 100%;"></div>
  </div>
</template>

<script>
var echarts = require("echarts");

export default {
  props: {
    rhythmData: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      chartId: 'rhythm' + Math.random().toString(32),
      options: {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: []
        },
        xAxis: { type: 'category' },
        yAxis: { type: "value" },
        series: []
      }
    }
  },
  watch: {
    rhythmData(newVal) {
      const keys = ['slabid', 'discharge', 'rm', 'fm', 'acc'];
      const source = this.dataToSeries(newVal, keys);
      const series = source.slice(1).map(() => ({
        type: 'line',
        smooth: true,
        seriesLayoutBy: 'row',
        // emphasis: { focus: 'series' }
      }));

      this.paint({ source, series });
    }
  },
  methods: {
    paint(data) {
      var myChart = echarts.init(document.getElementById(this.chartId));
      
      this.options.dataset.source = data['source'];
      this.options.series = data['series'];

      myChart.setOption(this.options);
    },
    dataToSeries(data, keys) {
      const source = new Array(keys.length).fill(0).map(() => new Array());
      for (const item of data) {
        for (let i = 0; i < keys.length; i++) {
          if (source[i].length === 0) {
            source[i].push(keys[i]);
          }
          source[i].push(item[keys[i]]);
        }
      }
      return source;
    }
  }
}
</script>