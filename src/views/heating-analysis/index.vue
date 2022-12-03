<template>
  <div>
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
  </div>
</template>

<script>
import SearchUpid from '@/components/SearchUpid';
import ConditionSelect from '@/components/ConditionSelect';

import { getUpidByUrl } from '@/utils';

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
      console.log('点击了搜索：', upid, this.conditionData)
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
.control-panel {
  width: 350px;

  .search-upid {
    padding-bottom: 15px;
    margin-bottom: 15px;
    box-shadow: 0px 1px 0px rgb(0 0 0 / 12%);
  }
}
</style>