<template>
  <div v-if="Object.keys(localTableData).length">
    <table class="rolling-table" border="1">
      <tr>
        <th class="roll">SlabID</th><td class="roll_num">{{ localTableData.slabid }}</td>
        <th class="roll">UPID</th><td class="roll_num">{{ localTableData.upid }}</td>
        <th class="roll">BasID</th><td class="roll_num" style="width: 10%">{{ localTableData.baseid }}</td>
      </tr>
    </table>

    <table class="rolling-table" border="1">
      <tr class="roll_In">
        <td colspan="12">PDI data</td>
      </tr>
      <tr>
        <th>SlabThick</th><td>{{ localTableData.slabthickness }}</td>
        <th>SlabWidth</th><td>{{ localTableData.slabwidth }}</td>
        <th>SlabLength</th><td>{{ localTableData.slablength }}</td>
        <th>SteelSpec</th><td>{{ localTableData.steelspec }}</td>
        <th>TappingCode</th><td>{{ localTableData.crcode }}</td>
        <th>Category</th><td>{{ localTableData.productcategory }}</td>
      </tr>
      <tr>
        <th>PlateThick</th><td>{{ localTableData.tgtplatethickness2 }}</td>
        <th>PlateWidth</th><td>{{ localTableData.tgtwidth }}</td>
        <th>PlateLength</th><td>{{ localTableData.tgtplatelength2 }}</td>
        <th>ControllRoll</th><td>{{ localTableData.crcode }}</td>
        <th>RS Code</th><td>{{''}}</td>
        <th>AD Code</th><td>{{ localTableData.adcontrolcode }}</td>
      </tr>
      <tr>
        <th>HeatMode</th><td>{{ localTableData.heating_pattern_code }}</td>
        <th>DischargeT</th><td>{{ localTableData.ave_temp_dis }}</td>
        <th>RestartTemp</th><td>{{ localTableData.tgttmrestarttemp1 }}</td>
        <th>FinishTemp</th><td>{{ localTableData.tgttmplatetemp }}</td>
        <th>RestartThick</th><td></td>
        <th></th><td></td>
      </tr>
    </table>

    <table class="rolling-table" border="1">
      <tr class="roll_In">
        <td colspan="12">Control Rolling</td>
      </tr>
      <tr>
        <th>FurnaceN/R</th><td>{{ localTableData.fce_row }}</td>
        <th>TimeInFurnace</th><td>{{ localTableData.in_fce_time }}</td>
        <th>TimeIn2Heat</th><td>{{ localTableData.staying_time_2 }}</td>
        <th>TimeInSoak</th><td>{{ localTableData.staying_time_soak }}</td>
        <th>DischargeTS</th><td :colspan="3">{{ localTableData.discharge_time }}</td>
      </tr>
        <tr>
          <th>SoakingSurfT</th><td>{{ localTableData.sur_temp_entry_soak }}</td>
          <th>DischargeT</th><td>{{ localTableData.ave_temp_dis }}</td>
          <th>RestartTemp</th><td>{{ localTableData.tgttmrestarttemp1 }}</td>
          <th>FinishTemp</th><td>{{ localTableData.tgttmplatetemp }}</td>
          <th>RestartThick</th><td></td>
          <th>SlabWeight</th><td>{{ localTableData.slabweight }}</td>
        </tr>
        <tr>
          <th>Thick[μ,CE]</th><td>{{ localTableData.thick_std_ce }}</td>
          <th>Thick[μ,DS]</th><td>{{ localTableData.thick_ave_ds }}</td>
          <th>Thick[μ,OS]</th><td>{{ localTableData.thick_ave_os }}</td>
          <th>Thick[Max,CE]</th><td>{{ localTableData.thick_max_ce }}</td>
          <th>Thick[Min,CE]</th><td>{{ localTableData.thick_min_ce }}</td>
          <th>Thick[σ,CE]</th><td>{{ localTableData.thick_ave_ce }}</td>
        </tr>
    </table>

    <table class="rolling-table" border="1">
      <tr class="roll_In">
        <td colspan="12">Roll Status</td>
      </tr>
      <tr>
        <th>RM TW ID</th><td>{{ localTableData.topwridrm }}</td>
        <th>RM TW Dia</th><td></td>
        <th>RM TW Plates</th><td></td>
        <th>RM BW ID</th><td>{{ localTableData.botwridrm }}</td>
        <th>RM BW Dia</th><td>{{ localTableData.topwrplatecountrm }}</td>
        <th>RM BW Plates</th><td>{{ localTableData.botwrplatecountrm }}</td>
      </tr>
      <tr>
        <th>FM TW ID</th><td>{{ localTableData.topwridfm }}</td>
        <th>FM TW Dia</th><td>{{ localTableData.topwrdia }}</td>
        <th>FM TW Plates</th><td>{{ localTableData.topwrplatecountfm }}</td>
        <th>FM BW ID</th><td>{{ localTableData.botwridfm }}</td>
        <th>FM BW Dia</th><td>{{ localTableData.botwrdia }}</td>
        <th>FM BW Plates</th><td>{{ localTableData.botwrplatecountfm }}</td>
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
      localTableData: {}
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
.rolling-table {
  width: 100%;
  margin-bottom: 15px;
  border-collapse: collapse;
}
</style>