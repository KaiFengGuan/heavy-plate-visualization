<template>
  <el-row class="visual-container">
    <el-col :span="6">
      <calendar-view class="calendar-view col-item" />
      <overview class="overview col-item" />
      <distribution-view class="distribution-view col-item" />
    </el-col>
    <el-col :span="12">
      <analysis-view class="analysis-view col-item" />
    </el-col>
    <el-col :span="6">
      <snapshot-view class="snapshot-view col-item" />
      <conclusion-view class="conclusion-view col-item" />
    </el-col>
  </el-row>
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
  }
}
</script>

<style lang="scss" >
@import './index.scss';

$card_bottom: 10px;

.visual-container {
  // background-color: #EDF0F4;
  // height: 100%;
  height: 910px;

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
}
</style>