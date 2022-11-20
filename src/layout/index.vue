<template>
  <el-container class="layout-container">
    <el-aside width="200px">
      <sidebar />
    </el-aside>
    <el-container>
      <el-header>
        我是头儿
      </el-header>
      <el-main>
        <app-main />
      </el-main>
      <el-footer>
        我是脚儿
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import AppMain from './components/AppMain.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'Layout',
  components: {
    AppMain,
    Sidebar
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100%;
}
</style>
