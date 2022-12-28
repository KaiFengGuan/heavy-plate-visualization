<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'link'"></svg-icon>
      <span>Analysis View</span>
    </div>
    <div class="analysis-chart">分析视图内容</div>
  </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import * as d3 from 'd3';
import { getDiagnosesDataByUpids } from '@/api/visualization';

export default {
  computed: {
    ...mapGetters([
      'selectedData'
    ])
  },
  mounted() {
    getDiagnosesDataByUpids().then(res => {
      const { data } = res;
      console.log(Object.keys(data).length)
    })
  }
};
</script>

<style lang="scss" scoped>
.analysis-chart {
  height: 870px;
}
</style>