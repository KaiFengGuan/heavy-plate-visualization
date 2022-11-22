<template>
  <div class="app-wrapper" :class="{ hideSidebar: sidebar }">
    <sidebar class="sidebar-container" />
    <el-container class="main-container">
      <el-header :height="variables.headerHeight">
        <app-header />
      </el-header>
      <el-main>
        <app-main />
      </el-main>
      <el-footer :height="variables.footerHeight">
        <app-footer />
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import variables from '@/styles/variables.scss';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import AppMain from './components/AppMain';
import Sidebar from './components/Sidebar';

export default {
  name: 'Layout',
  components: {
    AppHeader,
    AppFooter,
    AppMain,
    Sidebar
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    variables() {
      return variables
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  user-select: none;
}
.main-container {
  .el-header,
  .el-footer {
    padding: 0;
  }
}
</style>
