<template>
  <div class="header-container">
    <!-- <div class="hamburger hover-effect">
      <hamburger :isActive="!sidebar" @toggleClick="toggleSideBar" />
    </div> -->
    
    <div class="name hover-effect">厚板板形质量趋势监控系统</div>

    <el-dropdown class="avatar-container hover-effect" trigger="click">
      <div class="avatar-wrapper">
        <img v-if="avatarSrc" :src="avatar" class="user-avatar">
        <img v-else src="@/assets/images/defaultAvatar.webp" class="user-avatar">
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/">
          <el-dropdown-item>主页</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided @click.native="logout">
          <span style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Hamburger from '@/components/Hamburger';

export default {
  components: {
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    avatarSrc() {
      return this.avatar.length ? true : false;
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar');
    },
    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login`);
    }
  }
}
</script>

<style lang="scss" scoped>
// @import "~@/styles/variables.scss";

.header-container {
  height: 100%;
  background: #fff;
  // -webkit-box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  // box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  border-bottom: 1px solid #E5E6EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .hamburger {
    padding: 0px 15px;
  }
  .name {
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 0.12em;
    user-select: none;
    flex: 1;
    text-align: center;
  }

  .avatar-container {
    margin-right: 20px;

    .avatar-wrapper {
      margin-top: 5px;
      position: relative;
      
      img {
        width: 35px;
        height: 35px;
        border-radius: 10px;
      }

      .el-icon-caret-bottom {
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
  

  .hover-effect {
    cursor: pointer;
  }
}
</style>