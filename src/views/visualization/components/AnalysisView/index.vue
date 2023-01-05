<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'link'"></svg-icon>
      <span>Analysis View</span>
    </div>
    <div class="analysis-chart">
      <svg :id="panelId" style="width: 100%; height: 50px"></svg>
      <svg :id="chartId" style="width: 100%; height: 805px"></svg>
    </div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import { randomString } from '@/utils';
import { getDiagnosesDataByUpids } from '@/api/visualization';
import { diagnosisDataToRenderData } from './utils';
import AnalysisChart from './AnalysisChart';

export default {
  computed: {
    ...mapGetters([
      'selectedData'
    ])
  },
  data() {
    return {
      panelId: `panel_${randomString()}`,
      chartId: `analysis_${randomString()}`,
      diagnosis: {},
      analysisData: null,
      chartIns: null
    }
  },
  watch: {
    selectedData() {
      // const diagList = diagnosisDataToRenderData(this.diagnosis);
      // this.analysisData = Object.freeze(diagList);
    },
    analysisData() {
      this.renderAnalysisChart();
    }
  },
  created() {},
  mounted() {
    // 这个的触发应该是点了诊断按钮
    getDiagnosesDataByUpids().then(res => {
      const { data } = res;
      const diagList = diagnosisDataToRenderData(data);
      this.analysisData = Object.freeze(diagList);
    })

    const chart = document.getElementById(this.chartId);
    const width = chart.clientWidth;
    const height = chart.clientHeight;
    this.chartIns = new AnalysisChart({ width, height }, d3.select(chart));

    this.renderAnalysisChart();
  },
  methods: {
    renderAnalysisChart() {
      if (!this.chartIns || !this.analysisData || !this.analysisData.length) {
        return;
      }

      this.chartIns
        .dataInit(this.analysisData)
        .render()
    }
  }
};
</script>

<style lang="scss" scoped>
.analysis-chart {
  height: 870px;
}
</style>