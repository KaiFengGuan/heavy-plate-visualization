<template>
  <div class="map-container">
    <div :id="chartId" style="height: 100%; width: 100%"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  props: {
    mapData: {
      type: Array
    }
  },
  data() {
    return {
      chartId: `tempMap_${Math.random().toString(32)}`
    }
  },
  watch: {
    mapData(newVal) {
      const xData = [], yData = [], data = [];
      let min = Number.MAX_VALUE, max = Number.MIN_VALUE;

      const mapData = newVal;
      for (let i = 0; i < mapData.length; i++) {
        for (let j = 0; j < 9; j++) {   // 9个扫描数据
          const t = mapData[i][j];
          data.push([i, j, t]);
          if (t > max) max = t;
          if (t < min) min = t;
        }
        xData.push(i);
      }
      for (let j = 0; j < 9; j++) {
        yData.push(j);
      }

      this.paint(xData, yData, data, min, max);
    }
  },
  methods: {
    paint(xData = [], yData = [], data = [], min = 0, max = 1) {
      const myChart = echarts.init(document.getElementById(this.chartId));

      const options = {
        tooltip: {},
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: {
          type: 'category',
          data: yData
        },
        visualMap: {
          min: min,
          max: max,
          calculable: true,
          realtime: false,
          inRange: {
            color: [
              '#313695',
              '#4575b4',
              '#74add1',
              '#abd9e9',
              // '#e0f3f8',
              // '#ffffbf',
              // '#fee090',
              '#fdae61',
              '#f46d43',
              '#d73027',
              '#a50026'
            ]
          }
        },
        series: [
          {
            name: 'temp map',
            type: 'heatmap',
            data: data,
            emphasis: {
              itemStyle: {
                borderColor: '#333',
                borderWidth: 1
              }
            },
            progressive: 1000,
            animation: false
          }
        ]
      };

      myChart.setOption(options);
    }
  }
}
</script>

<style lang="scss" scoped>
.map-container {
  height: 100%;
  width: 100%;
}
</style>