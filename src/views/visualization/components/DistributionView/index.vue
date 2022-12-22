<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'settings'"></svg-icon>
      <span>Distribution View</span>
    </div>
    <div class="distribution-chart">
      <svg
        v-for="key in keys"
        :key="key"
        :id="key+svgId"
        style="width: 100%; height: 67px"
      ></svg>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import { randomString } from '@/utils';
import DistributionChart from './chart';

export default {
  computed: {
    ...mapGetters([
      'overviewData',
      'plateParams'
    ])
  },
  data() {
    return {
      svgId: `_distribution_${randomString()}`,
      keys: ['tgtwidth', 'tgtplatelength2', 'tgtthickness', 'tgtdischargetemp', 'tgttmplatetemp'],
      chartInsMap: new Map(), // 保存实例, 不需要响应式
      renderData: {},
    }
  },
  watch: {
    overviewData(newVal) {
      const renderData = this.processData(newVal);
      this.renderData = renderData;
      this.paint();
    },
    plateParams() {
      console.log('in vue: plateParams has changed!!!')
    }
  },
  mounted() {
    this.keys.forEach(key => {
      const svg = document.getElementById(key + this.svgId);
      const width = svg.clientWidth,
            height = svg.clientHeight;
      const ins = new DistributionChart({ width, height }, d3.select(svg));
      this.chartInsMap.set(key, ins);
    });
    this.paint();
  },
  methods: {
    processData(data) {
      const renderData = {};
      const bin = d3.bin().thresholds(15);
      this.keys.forEach(key => {
        const allLabel = data.map(d => d.label);
        renderData[key] = {
          name: key,
          values: bin(data.map(d => d[key])),
          label: [
            { label: '1', value: allLabel.filter(d => d==='1').length },
            { label: '0', value: allLabel.filter(d => d==='0').length },
            { label: '404', value: allLabel.filter(d => d==='404').length }
          ]
        };
      })
      return Object.freeze(renderData);
    },
    paint() {
      if (!Object.keys(this.renderData).length || !this.chartInsMap.size) {
        return;
      }
      const max = this.computeMaxBins();
      this.keys.forEach(key => {
        const ins = this.chartInsMap.get(key);
        ins && ins
          .dataInit(this.renderData[key], max)
          .render();
      });
    },
    computeMaxBins() {
      let maxBins = 0;
      for (const key of this.keys) {
        const values = this.renderData[key].values;
        maxBins = Math.max(...values.map(d => d.length));
      }
      return maxBins;
    }
  },
};
</script>

<style lang="scss" scoped>
.distribution-chart {
  height: 357px;
}

</style>