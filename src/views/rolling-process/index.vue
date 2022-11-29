<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="rollingTableData" />
      <!-- <heating-curve style="height: 400px" :curve-data="tempCurveData" /> -->
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';

import { getUpidByUrl } from '@/utils';
import {
  getRollingTableData
} from '@/api/dataOverview';

export default {
  components: {
    SubTable
  },
  data() {
    return {
      rollingTableData: {}
    }
  },
  computed: {
    getUpid() {
      return getUpidByUrl(this);
    }
  },
  created() {
    getRollingTableData(this.getUpid).then(res => {
      const { data } = res;
      this.rollingTableData = Object.freeze(data);
      // this.rollingTableData = data;
      console.log('getRollingTableData:', this.rollingTableData);
    });
  }
}
</script>