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
export default {};
</script>

<style lang="scss" scoped>
.analysis-chart {
  height: 870px;
}
</style>