<template>
  <div v-if="Object.keys(localTableData).length">
    <table class="fqc-table" border="1">
      <tr>
        <th>Plate ID</th><td>{{localTableData.upid}}</td>
        <th>Material</th><td>{{localTableData.material}}</td>
        <th>Start Time</th><td>{{localTableData.startTime}}</td>
        <th>End Time</th><td>{{localTableData.endTime}}</td>
      </tr>
    </table>

    <table class="fqc-table" border="1">
      <tr>
        <th colspan="12">Measure</th>
      </tr>
      <tr>
        <th>TargetThickness</th><td>{{localTableData.tgtThick}}</td>
        <th>TargetWidth</th><td>{{localTableData.tgtWidth}}</td>
        <th>TargetLength</th><td>{{localTableData.tgtLength}}</td>
        <th>AvgCamber</th><td>{{localTableData.avgCamber}}</td>
        <th>MinCamber</th><td>{{localTableData.minCamber}}</td>
        <th>MaxCamber</th><td>{{localTableData.maxCamber}}</td>
      </tr>
      <tr>
        <th>Thick</th><td>{{localTableData.thick}}</td>
        <th>Width</th><td>{{localTableData.width}}</td>
        <th>Length</th><td>{{localTableData.length}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      localTableData: this.tableData
    }
  },
  watch: {
    tableData(newVal) {
      this.localTableData = newVal;
    }
  }
}
</script>

<style lang="scss" scoped>
.fqc-table {
  width: 100%;
  margin-bottom: 15px;
  border-collapse: collapse;
}
</style>