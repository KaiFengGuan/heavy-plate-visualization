<template>
  <div class="compare-chart">
    <svg :id="svgId" style="width: 100%; height: 100%"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import { randomString } from '@/utils';
import CompareChart from './chart';
import TooltipClass from '../Tooltip';

/**
 * rawData attribute：
 *  - name: string
 *  - xData: []
 *  - yData: []
 *  - max: []
 *  - min: []
 *  - avg: []
 *  - std: []
 */
export default {
  props: {
    deviationFlag: {  // 是否开启偏差分析
      type: Boolean,
      default: true
    },
    rawData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      svgId: `compareChart_${randomString()}`,
      chartIns: null,
      tooltipIns: null
    }
  },
  created() {
    // console.log('子组件数据：', this.rawData, this)
  },
  mounted() {
    const svg = document.getElementById(this.svgId);
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    this.chartIns = new CompareChart({ width, height }, d3.select(svg));

    this.tooltipIns = new TooltipClass(
      { width: 0, height: 0 },
      svg.parentElement,
      `tooltip_${randomString()}`
    );

    if(Object.keys(this.rawData).length) {
      this.paint();
    }
  },
  methods: {
    paint() {
      this.chartIns
        .dataInit(this.rawData)
        .propsTooltip(this.tooltipIns)
        .render()
    }
  }
}
</script>

<style lang="scss" scoped>
.compare-chart {
  width: 100%;
  height: 280px;
  margin-bottom: 20px;
  position: relative;
  user-select: none;
  border-radius: 10px;
  box-shadow: 0 0 4px rgb(0 0 0 / 24%);
}
</style>