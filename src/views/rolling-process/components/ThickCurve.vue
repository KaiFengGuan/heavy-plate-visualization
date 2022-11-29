<template>
  <div>
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
    }
  },
  data() {
    return {
      chartId: `thicknessCurve_${Math.random().toString(32)}`,
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
      const { position, ...yValue } = newVal;
      const yData = Object.keys(yValue).map(key => {
        return {
          name: key,
          data: yValue[key]
        }
      })
      this.paint(position, yData);
    }
  },
  methods: {
    paint(xData = [], yData = []) {
      const myChart = echarts.init(document.getElementById(this.chartId));

      const options = this.options;
      options.xAxis.data = xData;
      options.series = yData.map(item => {
        item['type'] = 'line';
        item['smooth'] = true;
        return item;
      });

      myChart.setOption(this.options);
    }
  }
}
</script>