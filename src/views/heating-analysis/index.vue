<template>
  <div class="analysis-wrapper">
    <div class="control-panel">
      <search-upid
        class="search-upid"
        :upid="currentUpid"
        @clickSearch="searchHandle"
        @clickAnalysis="analysisHandle"
      />
      <condition-select
        :plate-data="plateData"
        @changeData="changeDataHandle"
      />
    </div>
    <div class="analysis-main">
      
    </div>
  </div>
</template>

<script>
import SearchUpid from '@/components/SearchUpid';
import ConditionSelect from '@/components/ConditionSelect';

import { getUpidByUrl } from '@/utils';
import { getPlateDataByUpid } from '@/api/dataAnalysis';

export default {
  components: {
    SearchUpid,
    ConditionSelect
  },
  data() {
    return {
      currentUpid: '',
      plateData: {},      // 钢板自身规格数据
      conditionData: {},  // 规格范围数据
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
      console.log('点击了分析：', upid, this.conditionData)
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
}

.control-panel {
  width: 350px;
  position: fixed;

  .search-upid {
    padding-bottom: 15px;
    margin-bottom: 15px;
    box-shadow: 0px 1px 0px rgb(0 0 0 / 12%);
  }
}

.analysis-main {
  margin-left: 350px;
  padding-left: 20px;
}
</style>