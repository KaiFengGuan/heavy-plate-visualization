<template>
  <el-card>
    <div slot="header" class="clearfix">
      <svg-icon :icon-class="'overview'"></svg-icon>
      <span>Overview</span>
    </div>
    <div class="overview-container">
      <div style="width: 240px;"></div>
      <div style="flex: 1;"></div>
    </div>
  </el-card>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.overview-container {
  display: flex;
  height: 100%;

  div {
    position: relative;
  }
}
</style>