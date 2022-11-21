<template>
  <div class="header-container">
    <div class="hamburger">icon</div>
    <div class="name">厚板板形质量趋势监控系统</div>
    <div class="avatar">avator</div>
  </div>
</template>

<style lang="scss" scoped>
// @import "~@/styles/variables.scss";

.header-container {
  height: 100%;
  background: #fff;
  -webkit-box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  box-shadow: 0 1px 4px rgb(0 0 0 / 12%);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .hamburger {
    padding: 0px 15px;
  }
  .name {
    font-size: 22px;
    font-weight: bold;
  }
  .avatar {
    margin-right: 20px;
  }
}
</style>