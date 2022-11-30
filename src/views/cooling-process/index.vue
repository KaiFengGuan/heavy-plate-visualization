<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="coolingTableData" />
      <temp-map style="height: 400px;" :map-data="scannerTempData" />
      <div class="chart-wrapper">
        <cooling-curve :curve-data="tempCurveData" chart-name="temp" />
        <cooling-curve :curve-data="tempCurveData" chart-name="speed" />
      </div>
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';
import TempMap from './components/TempMap';
import CoolingCurve from './components/CoolingCurve';

import { getUpidByUrl } from '@/utils';
import {
  getCoolingTableData,
  getCoolingTempMapData,
  getCoolingCurveData
} from '@/api/dataOverview';

export default {
  components: {
    SubTable,
    TempMap,
    CoolingCurve
  },
  data() {
    return {
      coolingTableData: {},
      scannerTempData: [],
      tempCurveData: {}
    }
  },
  computed: {
    getUpid() {
      return getUpidByUrl(this);
    }
  },
  created() {
    getCoolingTableData(this.getUpid).then(res => {
      const { data } = res;
      this.coolingTableData = Object.freeze(data);
      // console.log('getCoolingTableData: ', this.coolingTableData)
    });

    getCoolingTempMapData(this.getUpid).then(res => {
      const { data } = res;
      this.scannerTempData = Object.freeze(data);
      // console.log('getCoolingTempMapData: ', this.scannerTempData)
    });

    getCoolingCurveData(this.getUpid).then(res => {
      const { data } = res;
      this.tempCurveData = Object.freeze(data);
      // console.log('getCoolingCurveData: ', this.tempCurveData)
    })
  }
}
</script>

<style lang="scss" scoped>
.chart-wrapper {
  width: 100%;
  height: 400px;
  display: flex;
}
</style>