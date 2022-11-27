<template>
  <div v-if="Object.keys(LocalTableData).length">
    <table class="heat-table" border="1">
      <tr>
        <th class='furnace'>SlabID</th>
        <td class="furnace_num">{{LocalTableData.slabid}}</td>
        <th class='furnace'>UPID</th>
        <td class="furnace_num">{{LocalTableData.upid}}</td>
        <th class='furnace'>Thick</th>
        <td class="furnace_num" style="width: 10%">{{LocalTableData.thick}}</td>
      </tr>
    </table>
    <table class="heat-table" border="1">
      <tr class="furnace_In">
        <td colspan="10">Furnace Information</td>
      </tr>
      <tr>
        <th class="furnace_temp">Heat Mode</th>
        <td class="furnace_value">{{LocalTableData.HeatMode}}</td>
        <th class="furnace_temp">Furnace No</th>
        <td class="furnace_value">{{LocalTableData.furnaceNo}}</td>
        <th class="furnace_temp">Time in Furnace</th>
        <td class="furnace_value">{{LocalTableData.duration}}</td>
        <td colspan="2" class="furnace_value">{{LocalTableData.durationRange[0]}}</td>
        <td colspan="2" class="furnace_value">{{LocalTableData.durationRange[1]}}</td>
      </tr>
      <tr>
        <th colspan="2" class="furnace_name">Preheating Section</th>
        <th colspan="2" class="furnace_name">Heating Section 1</th>
        <th colspan="2" class="furnace_name">Heating Section 2</th>
        <th colspan="2" class="furnace_name">Soaking Section</th>
        <th colspan="2" class="furnace_name">Discharging</th>
      </tr>
      <tbody v-for="(raw, index1) in sectionRaws" :key="raw">
        <template v-for="(name, index2) in sectionNames">
          <th class="furnace_temp" :key="`${index1}_${index2}_th`">{{raw}}</th>
          <td class="furnace_value" :key="`${index1}_${index2}_td`">{{sectionValue(name, raw)}}</td>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'SubTable',
  props: {
    tableData: {
      type: Object,
      require: true
    }
  },
  data() {
    return {
      LocalTableData: {},
      sectionNames: ['preheating', 'heating1', 'heating2', 'soaking', 'discharging'],
      sectionRaws: ['entry', 'surface', 'center', 'seat', 'average', 'duration']
    }
  },
  watch: {
    tableData(newVal) {
      // console.log('in watch: ', newVal)
      this.LocalTableData = newVal
      // console.log(this.LocalTableData)
    }
  },
  computed: {},
  mounted() {
    // console.log('in subTable', this.tableData)
    // console.log(Object.keys(this.tableData).length)
  },
  methods: {
    sectionValue(col, raw) {
      const section  = this.LocalTableData['section'];
      const colData = section[col];
      // console.log('colData', colData, colData[raw])
      if (colData && colData[raw]) return colData[raw]
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.heat-table {
  border-collapse: collapse;
  margin-bottom: 10px;
  width: 100%;
}
</style>
