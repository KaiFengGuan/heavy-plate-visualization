<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="rollingTableData" />
      <thick-curve style="height: 300px" :curve-data="thickCurveData" />
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';
import ThickCurve from './components/ThickCurve';

import { getUpidByUrl } from '@/utils';
import {
  getRollingTableData,
  getRollingThickCurve
} from '@/api/dataOverview';

export default {
  components: {
    SubTable,
    ThickCurve
  },
  data() {
    return {
      rollingTableData: {},
      thickCurveData: {},
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
      // console.log('getRollingTableData:', this.rollingTableData);
    });

    getRollingThickCurve(this.getUpid).then(res => {
      const { data } = res;
      this.thickCurveData = Object.freeze(data);
      // console.log('getRollingThickCurve: ', this.thickCurveData);
    })
  }
}
</script>