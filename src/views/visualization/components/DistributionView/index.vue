<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'settings'"></svg-icon>
      <span>Distribution View</span>
    </div>
    <div class="distribution-chart">
      <svg :id="svgId" style="width: 100%; height: 100%"></svg>
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
      'selectedData'
    ])
  },
  data() {
    return {
      svgId: `distrubutionChart_${randomString()}`,
      chartIns: null,
      renderData: null,
    }
  },
  watch: {
    selectedData() {
      console.log('分布视图, selectedData改变了')
      this.renderData = [1,2,3]
    },
    renderData() {
      this.paint();
    }
  },
  mounted() {
    const svg = document.getElementById(this.svgId);
    const width = svg.clientWidth;
    const height = svg.clientHeight;

    this.chartIns = new DistributionChart({ width, height }, d3.select(svg));
    if (this.renderData) {
      this.paint();
    }
  },
  methods: {
    paint() {
      if (!this.chartIns) return;
      this.chartIns
        .dataInit(this.renderData)
        .render()
    }
  },
};
</script>

<style lang="scss" scoped>
.distribution-chart {
  height: 357px;

  svg {
    border: 1px red solid;
  }
}

</style>