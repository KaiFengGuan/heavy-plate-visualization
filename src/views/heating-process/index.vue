<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="plateHeatingData" />
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';

import { getHeatingTableData } from '@/api/dataOverview';

export default {
  components: {
    SubTable
  },
  data() {
    return {
      plateHeatingData: {}
    }
  },
  computed: {
    getUpid() {
      const route = this.$route;
      const { query } = route;
      if (query && query['upid']) {
        return query['upid'];
      }
      return '';
    }
  },
  created() {
    getHeatingTableData(this.getUpid).then(res => {
      const { data } = res;
      // this.plateHeatingData = Object.freeze(data);
      this.plateHeatingData = data;
      // console.log('plateHeatingData: ', this.plateHeatingData)
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
