<template>
  <div class="heating-curve-container">
    <div :id="chartId" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    curveData: {
      type: Object
    }
  },
  data() {
    return {
      chartId: `heatingCurve_${Math.random().toString(32)}`,
      options: {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        dataset: {
          source: []
        },
        xAxis: { type: 'category', data: [] },
        yAxis: { type: "value" },
        series: []
      }
    }
  },
  watch: {
    curveData(newVal) {

      const { position, section, ...lineData } = newVal;
      const options = this.options;

      options.xAxis.data = position;
      
      for (let key in lineData) {
        options.series.push({
          name: key,
          type: 'line',
          smooth: true,
          data: lineData[key]
        });
      }
      this.paint();
    }
  },
  methods: {
    paint() {
      const myChart = echarts.init(document.getElementById(this.chartId));
      myChart.setOption(this.options);
    }
  }
}
</script>