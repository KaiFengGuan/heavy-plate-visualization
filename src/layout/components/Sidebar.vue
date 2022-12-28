<template>
  <div class="sidebar-menu">
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
    <div class="hamburger">
      <hamburger :isActive="!sidebar" @toggleClick="toggleSideBar" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import variables from '@/styles/variables.scss';
import SidebarItem from './SidebarItem';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    SidebarItem,
    Hamburger
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
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
  }
}
</script>

<style lang="scss" scoped>
.sidebar-menu {
  position: relative;
  border-right: 1px solid #E5E6EB;

  .hamburger {
    position: absolute;
    bottom: 15px;
    right: 15px;
  }
}
</style>