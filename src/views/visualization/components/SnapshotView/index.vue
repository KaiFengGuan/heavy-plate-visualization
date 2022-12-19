<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'snapshot'"></svg-icon>
      <span>Snapshot view</span>
    </div>
    <div class="snapshot-chart">分析视图快照</div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.snapshot-chart {
  height: 406px;
}
</style>