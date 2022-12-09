<template>
  <div class="analysis-wrapper">
    <div class="control-panel">
      <search-upid
        class="search-upid"
        :upid="currentUpid"
        @clickSearch="searchHandle"
        @clickAnalysis="analysisHandle"
      />
      <div class="condition-select">
        <div class="title">对比分析数据筛选</div>
        <condition-select
          :plate-data="plateData"
          @changeData="changeDataHandle"
        />
      </div>
      
    </div>
    <div class="analysis-main">
      <template v-if="visualList.length">
        <compare-analysis-chart
          v-for="item in visualList"
          :key="item.name"
          :raw-data="item"
        />
      </template>
    </div>
  </div>
</template>

<script>
import SearchUpid from '@/components/SearchUpid';
import ConditionSelect from '@/components/ConditionSelect';
import CompareAnalysisChart from '@/components/CompareAnalysisChart';

import { getUpidByUrl } from '@/utils';
import { 
  getPlateDataByUpid,
  getHeatingAnalysisDataByUpid
} from '@/api/dataAnalysis';

export default {
  components: {
    SearchUpid,
    ConditionSelect,
    CompareAnalysisChart
  },
  data() {
    return {
      currentUpid: '',
      plateData: {},      // 钢板自身规格数据
      conditionData: {},  // 规格范围数据
      visualList: [],     // 对比分析结果
    }
  },
  created() {
    const upid = getUpidByUrl(this);
    this.currentUpid = upid.length ? upid : '18A01003000';
  },
  methods: {
    searchHandle(upid) {
      this.currentUpid = upid;
      getPlateDataByUpid(upid).then(res => {
        const { data } = res;
        this.plateData = data;
      });
    },
    analysisHandle(upid) {
      console.log('点击了分析：', this.conditionData)
      getHeatingAnalysisDataByUpid(upid, this.conditionData).then(res => {
        const { data } = res;
        this.visualList = data;
        // console.log('对比分析结果：', data)
      });
    },
    changeDataHandle(data) {
      this.conditionData = data;
      console.log('改变规格条件数据: ', this.conditionData)
    }
  }
}
</script>

<style lang="scss" scoped>
.analysis-wrapper {
  position: relative;
  display: flex;

  .condition-select {
    .title {
      margin-top: 15px;
      color: rgba(0, 0, 0, 0.55);
      font-size: 16px;
      font-weight: 700;
      line-height: 40px;
    }

    height: 565px;
    overflow-x: hidden;
    overflow-y: hidden;
    margin-left: 0.4rem;
    margin-right: 0.4rem;
    // overflow: hidden;
    &:hover {
      overflow-y: scroll;
      margin-right: 0;
    }
  }
}

.control-panel {
  width: 350px;
  position: fixed;

  .search-upid {
    padding-bottom: 15px;
    box-shadow: 0px 1px 0px rgb(0 0 0 / 12%);
  }
}

.analysis-main {
  margin-left: 350px;
  padding-left: 20px;
  flex-grow: 1;
}
</style>