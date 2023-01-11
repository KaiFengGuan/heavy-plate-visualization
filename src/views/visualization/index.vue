<template>
  <div class="visual-container">
    <el-row>
      <el-col :span="6">
        <calendar-view class="calendar-view col-item" />
        <overview class="overview col-item" />
        <distribution-view class="distribution-view col-item" />
      </el-col>
      <el-col :span="18">
        <analysis-view class="analysis-view col-item" />
      </el-col>
    </el-row>
    <div class="my-drawer" :class="{'drawer-open': drawerState}">
      <snapshot-view class="snapshot-view col-item" />
      <conclusion-view class="conclusion-view col-item" />
    </div>
    <div class="switch-botton" :class="{'drawer-active': drawerState}" @click="switchDrawerHandle">
      <svg-icon icon-class="arrow-double-left"></svg-icon>
    </div>
  </div>
  
</template>

<script>
import CalendarView from './components/CalendarView/index';
import Overview from './components/Overview/index';
import AnalysisView from './components/AnalysisView/index';
import SnapshotView from './components/SnapshotView/index';
import ConclusionView from './components/ConclusionView/index';
import DistributionView from './components/DistributionView/index';

export default {
  components: {
    CalendarView,
    Overview,
    DistributionView,
    AnalysisView,
    SnapshotView,
    ConclusionView
  },
  data() {
    return {
      drawerState: false
    }
  },
  methods: {
    switchDrawerHandle() {
      const oldState = this.drawerState;
      this.drawerState = !oldState;
    }
  }
}
</script>

<style lang="scss" >
@import './index.scss';

$card_bottom: 10px;

.visual-container {
  height: 910px;
  position: relative;
  overflow: hidden;
  padding-bottom: 20px;

  .el-card {
    margin-bottom: $card_bottom;
  }

  .el-col {
    height: 100%;
    padding-left: 10px;

    &:first-child {
      padding-left: 0;
    }
  }

  .col-item:last-child {
    margin-bottom: 0;
  }

  .my-drawer {
    width: 400px;
    position: absolute;
    z-index: 888;
    top: 0;
    right: -500px;
    transition: right 0.28s;
  }

  .my-drawer.drawer-open {
    right: 0;
    transition: right 0.28s;
  }

  .switch-botton {
    width: 30px;
    height: 30px;
    border: 1px solid #7e7e7e;
    border-radius: 50%;
    position: fixed;
    z-index: 999;
    bottom: 50px;
    right: 60px;
    font-size: 13px;
    cursor: pointer;
    user-select: none;
  }

  .switch-botton {
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      transition: transform 0.28s;
      transform: rotate(0deg);
    }
  }

  .drawer-active {
    svg {
      transition: transform 0.28s;
      transform: rotate(180deg);
    }
  }
}
</style>