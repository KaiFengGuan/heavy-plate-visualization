<template>
  <div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :default-active="activeMenu"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse="isCollapse"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import variables from '@/styles/variables.scss';
import SidebarItem from './SidebarItem';

export default {
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters([
      'permission_routes',
      'sidebar'
    ]),
    activeMenu() {
      return this.$route.path
    },
    variables() {
      return variables
    },
    isCollapse() {
      return this.sidebar
    }
  }
}
</script>