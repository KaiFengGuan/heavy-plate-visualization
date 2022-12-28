<template>
  <div class="app-wrapper" :class="{ hideSidebar: sidebar }">
    <sidebar class="sidebar-container" />
    <el-container direction="vertical" class="main-container">
      <el-header v-if="displayHeader" :height="variables.headerHeight">
        <app-header />
      </el-header>
      <el-main>
        <app-main />
      </el-main>
      <el-footer v-if="displayHeader" :height="variables.footerHeight">
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
    },
    displayHeader() {
      return this.$route.path !== '/monitoring/visualization';
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar-container {
  user-select: none;
}
.main-container {
  overflow-y: hidden;
  
  .el-header,
  .el-footer {
    padding: 0;
    z-index: 99;
  }
}
</style>
