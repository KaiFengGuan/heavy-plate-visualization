<template>
  <div class="pass-container">
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
      chartId: `passCurve_${Math.random().toString(32)}`,
      localCurveData: this.curveData,
      options: {
        legend: {},
        tooltip: {
          trigger: 'axis',
          showContent: false
        },
        xAxis: {
          type: 'category',
          data: [],
          show: true,
          name: 'Passes',
          nameLocation: 'center',
          nameTextStyle: {
            fontFamily: 'Arial',
            fontWeight: 'normal',
            fontSize: 14,
            lineHeight: 20
          },
          axisLabel: {
            fontSize: 10
          }
        },
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
        case 'meas':
          this.setMeasChart();
          break;
        case 'size':
          this.setSizeChart();
          break;
      }

      myChart.setOption(this.options);
    },
    setMeasChart() {
      const { pass, epsilon, passPhase, ...yValue } = this.localCurveData;
      const options = this.options;

      options.xAxis.data = pass;

      const yAxisOpts = [
        {
          name: 'Forces(kt)\nTorque(MN.m)',
        },
        {
          name: 'Epsilon(%)',
        }
      ];
      options.yAxis = this.setYAxisOpts(yAxisOpts);

      Object.keys(yValue).forEach(key => {
        options.series.push({
          yAxisIndex: 0,
          name: key,
          data: yValue[key],
          type: 'line'
        })
      });
      options.series.push({
        yAxisIndex: 1,
        name: 'epsilon',
        data: epsilon,
        type: 'line',
        markArea: this.setMarkArea(passPhase)
      });
    },
    setSizeChart() {
      const { pass, passPhase, ...yValue } = this.localCurveData;
      const options = this.options;

      options.xAxis.data = pass;

      const yAxisOpts = [
        {
          name: 'width(m)',
        },
        {
          name: 'thickness(mm)',
        }
      ];
      options.yAxis = this.setYAxisOpts(yAxisOpts);

      ['width', 'thickness'].forEach((key, idx) => {
        const item = {
          yAxisIndex: idx,  // 这里只有两条线
          name: key,
          data: yValue[key],
          type: 'line'
        };
        if (idx === 0) {
          item['markArea'] = this.setMarkArea(passPhase);
        }
        options.series.push(item);
      });
    },
    setYAxisOpts(yAxis) {
      return yAxis.map(item => {
        item['show'] = true;
        item['type'] = 'value';
        item['nameLocation'] = 'center';
        item['nameTextStyle'] = {
          fontFamily: 'Arial',
          fontWeight: 'normal',
          lineHeight: 20,
          fontSize: 14,
        };
        return item;
      })
    },
    setMarkArea(passPhase) {  // passPhase长度为4
      return {
        itemStyle: {
          color: 'rgba(255, 173, 177, 0.4)'
        },
        data: [
          [{ xAxis: passPhase[0] }, { xAxis: passPhase[1] }],
          [{ xAxis: passPhase[2] }, { xAxis: passPhase[3] }]
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.pass-container {
  height: 100%;
  width: 100%;
}
</style>