<template>
  <div>
    <template v-if="getUpid.length === 0">
      <span>请输入upid进行查询</span>
    </template>
    <template v-else>
      <sub-table :table-data="plateTableData" />
      <shape-map style="height: 400px;" :map-data="plateShapeData" />
    </template>
  </div>
</template>

<script>
import SubTable from './components/SubTable';
import ShapeMap from './components/ShapeMap';

import { getUpidByUrl } from '@/utils';
import { getPlateShapeData } from '@/api/dataOverview';

export default {
  components: {
    SubTable,
    ShapeMap
  },
  data() {
    return {
      plateShapeData: [],
      plateTableData: {}
    }
  },
  computed: {
    getUpid() {
      return getUpidByUrl(this);
    }
  },
  created() {
    getPlateShapeData(this.getUpid).then(res => {
      const { data } = res;
      const { shapeData, ...tableData } = data;
      this.plateShapeData = Object.freeze(shapeData);
      this.plateTableData = Object.freeze(tableData);
      // console.log('getPlateShapeData: ', this.plateShapeData, this.plateTableData)
    });
  }
}
</script>

<style lang="scss" scoped>
</style>