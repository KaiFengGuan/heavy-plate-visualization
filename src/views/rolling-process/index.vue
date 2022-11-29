<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="rollingTableData" />
      <thick-curve style="height: 300px" :curve-data="thickCurveData" />
      <div class="pass-curve-wrapper">
        <pass-curve chart-name="meas" :curve-data="measCurveData" />
        <pass-curve chart-name="size" :curve-data="sizeCurveData" />
      </div>
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';
import ThickCurve from './components/ThickCurve';
import PassCurve from './components/PassCurve';

import { getUpidByUrl } from '@/utils';
import {
  getRollingTableData,
  getRollingThickCurve,
  getRollingMeasCurve,
  getRollingSizeCurve
} from '@/api/dataOverview';

export default {
  components: {
    SubTable,
    ThickCurve,
    PassCurve
  },
  data() {
    return {
      rollingTableData: {},
      thickCurveData: {},
      measCurveData: {},
      sizeCurveData: {}
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
    });

    getRollingMeasCurve(this.getUpid).then(res => {
      const { data } = res;
      this.measCurveData = Object.freeze(data);
    })

    getRollingSizeCurve(this.getUpid).then(res => {
      const { data } = res;
      this.sizeCurveData = Object.freeze(data);
    })
  }
}
</script>

<style lang="scss" scoped>
.pass-curve-wrapper {
  width: 100%;
  height: 300px;
  display: flex;
}
</style>