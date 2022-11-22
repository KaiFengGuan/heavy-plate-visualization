<template>
  <div class="footer-container">
    <span>Copyright &copy; {{new Date().getFullYear()}} 东北大学·流程工业综合自动化国家重点实验室 All Rights Reserved.</span>
  </div>
</template>

<style lang="scss" scoped>
.footer-container {
  height: 100%;
  background: #fff;
  -webkit-box-shadow: 1px 0 4px 0 rgb(0 0 0 / 12%);
  box-shadow: 1px 0 4px 0 rgb(0 0 0 / 12%);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  
  span {
    user-select: none;
    cursor: pointer;
  }
}
</style>