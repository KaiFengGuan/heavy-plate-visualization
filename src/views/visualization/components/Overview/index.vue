<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'overview'"></svg-icon>
      <span>Overview</span>
    </div>
    <div class="overview-container">
      <div style="width: 240px;">
        <svg :id="scatterId" style="width: 100%; height: 100%"></svg>
      </div>
      <div style="flex: 1;">
        <svg :id="sankeyId" style="width: 100%; height: 100%"></svg>
      </div>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import { randomString } from '@/utils';
import { getScatterDataByTime } from '@/api/visualization';

import TooltipClass from '@/components/Tooltip';
import ScatterChart from './ScatterChart';

export default {
  computed: {
    ...mapGetters([
      'curMonth',
      'dateRange',
      'selectedData'
    ])
  },
  data() {
    return {
      scatterId: `scatterChart_${randomString()}`,
      sankeyId: `sankeyChart_${randomString()}`,
      scatterData: [],
      sankeyData: [],
      scatterIns: null,
      sankeyIns: null,
    }
  },
  watch: {
    selectedData() {
      this.processRenderData();
    },
    dateRange() {
      this.fetchData();
    },
    scatterData() {
      this.scatterRender();
    },
    sankeyData() {
      this.sankeyRender();
    }
  },
  created() {
    this.fetchData();
  },
  mounted() {
    this.createInstance('scatter');
    this.createInstance('sankey');
  },
  methods: {
    fetchData() {
      const range = this.dateRange;
      getScatterDataByTime({ startTime: range[0], endTime: range[1] }).then((res) => {
        const { data } = res;
        this.$store.dispatch('visual/saveSelectedData', Object.freeze(data));
      });
    },
    processRenderData() {
      const dataList = this.selectedData;
      const scatters = [], sankeys = [];
      for (const item of dataList) {
        const {
          x, y, upid, toc, label,
          steelspec
        } = item;

        scatters.push({ x, y, upid, toc, label, steelspec });
        sankeys.push({ upid, toc, label });
      }
      this.scatterData = Object.freeze(scatters);
      this.sankeyData = Object.freeze(sankeys);
    },
    createInstance(key) {   // key 为 scatter 或 sankey
      const svg = document.getElementById(this[`${key}Id`]);
      const width = svg.clientWidth;
      const height = svg.clientHeight;

      let ins = null;
      switch(key) {
        case 'scatter':
          ins = new ScatterChart({ width, height }, d3.select(svg));
          break;
        case 'sankey':
          ins = {'b': 2};
          break;
        default:
          break;
      }

      if (ins) this[`${key}Ins`] = ins;
      if (this[`${key}Data`].length) this[`${key}Render`]();
    },
    scatterRender() {
      if (!this.scatterIns) return;
      this.scatterIns
        .dataInit(this.scatterData)
        // .propsTooltip(this.tooltipIns)
        .render()
    },
    sankeyRender() {
      if (!this.sankeyIns) return;
    }
  }
};
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  height: 100%;

  div {
    position: relative;
  }

  svg {
    border: 1px solid grey;
  }
}
</style>