<template>
  <div class="cooling-curve-container">
    <div :id="chartId" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    curveData: {
      type: Object,
      default: {}
    },
    chartName: {
      type: String,
      require: true
    }
  },
  data() {
    return {
      chartId: `coolingCurve_${Math.random().toString(32)}`,
      localCurveData: this.curveData,
      options: {
        legend: {
          data: []
        },
        // tooltip: {
        //   trigger: 'axis',
        //   showContent: false
        // },
        xAxis: { type: 'category' },
        yAxis: { type: 'value' },
        series: []
      }
    }
  },
  watch: {
    curveData(newVal) {
      this.localCurveData = newVal;
      this.paint();
    }
  },
  methods: {
    paint() {
      const myChart = echarts.init(document.getElementById(this.chartId));

      switch(this.chartName.toLowerCase()) {
        case 'temp':
          this.setTempChart();
          break;
        case 'speed':
          this.setSpeedChart();
          break;
      }

      myChart.setOption(this.options);
    },
    setTempChart() {
      const legend = ['p1', 'p2', 'p3', 'p4'];

      const series = [];
      for (let key of legend) {
        series.push({
          name: key,
          type: 'line',
          smooth: true,
          data: this.localCurveData[key] ?? []
        })
      }

      const options = this.options;
      options.series = series;
      options.legend.data = legend;
    },
    setSpeedChart() {
      const { speed } = this.localCurveData;

      const options = this.options;
      options.legend.data = ['speed'];
      options.series.push({
        name: 'speed',
        type: 'line',
        smooth: true,
        data: speed ?? []
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.cooling-curve-container {
  height: 100%;
  width: 100%;
}
</style>