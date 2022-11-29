<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="plateHeatingData" />
      <heating-curve style="height: 400px" :curve-data="tempCurveData" />
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';
import HeatingCurve from './components/HeatingCurve';

import { getUpidByUrl } from '@/utils';
import {
  getHeatingTableData,
  getHeatingCurveData
} from '@/api/dataOverview';

export default {
  components: {
    SubTable,
    HeatingCurve
  },
  data() {
    return {
      plateHeatingData: {},
      tempCurveData: {}
    }
  },
  computed: {
    getUpid() {
      return getUpidByUrl(this);
    }
  },
  created() {
    getHeatingTableData(this.getUpid).then(res => {
      const { data } = res;
      // this.plateHeatingData = Object.freeze(data);
      this.plateHeatingData = data;
      // console.log('plateHeatingData: ', this.plateHeatingData)
    });

    getHeatingCurveData(this.getUpid).then(res => {
      const { data } = res;
      this.tempCurveData = Object.freeze(data);
      // console.log('tempCurveData: ', this.tempCurveData);
    });
  },
  mounted() {
    // console.log('in heating process $route: ', this.$route);
    // console.log(this.getUpid)
  },
  methods: {}
}
</script>

<style lang="scss" scoped>

</style>
