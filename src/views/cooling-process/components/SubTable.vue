<template>
  <div v-if="Object.keys(localTableData).length">
    <table class="cooling-table" border="1">
      <tr>
        <th class='cool' colspan="2">Plate ID</th><td class="cool_num" colspan="2">{{localTableData.upid}}</td>
        <th class='cool' colspan="2">Slab ID</th><td class="cool_num" colspan="2">{{localTableData.slabid}}</td>
        <th class='cool' colspan="2">Date</th><td class="cool_num" style="width: 10%" colspan="2">{{localTableData.toc}}</td>
			</tr>
			<tr class="cool_In">
        <td :colspan=12>Cool Information</td>
      </tr>
			<tr>
        <th class="cool_value">Thickness</th><td class="cool_value">{{localTableData.thick}}</td>
        <th class="cool_value">Width</th><td class="cool_value">{{localTableData.width}}</td>
        <th class="cool_value">Length</th><td class="cool_value">{{localTableData.length}}</td>
        <th class="cool_value">FinishTemp</th><td class="cool_value">{{localTableData.rolling_finish_temp}}</td>
        <th class="cool_value">FiniTempOrig</th><td class="cool_value">{{localTableData.cooling_start_temp}}</td>
        <th class="cool_value">CoolStopOrig</th><td class="cool_value">{{localTableData.cooling_stop_temp}}</td>
			</tr>
			<tr>
        <th class="cool_value">CoolStop</th>
        <td class="cool_value">{{localTableData.cooling_stop_temp1}}</td>
        <td class="cool_value">{{localTableData.cooling_stop_temp2}}</td>
        <td class="cool_value"></td>
        <th class="cool_value">TargetRate</th>
        <td class="cool_value">{{localTableData.cooling_rate1}}</td>
        <td class="cool_value">{{localTableData.cooling_rate2}}</td>
        <td class="cool_value"></td>
        <th class="cool_value">AccMode</th><td class="cool_value">{{localTableData.cooling_mode}}</td>
        <th class="cool_value">OpMode</th><td class="cool_value">{{localTableData.operate_mode}}</td>
			</tr>
			<tr>
        <th class="cool_value">MaterialID</th><td class="cool_value">{{localTableData.material}}</td>
        <th class="cool_value">&#91;B&#93;</th><td class="cool_value">{{localTableData.chemistry_b}}</td>
        <th class="cool_value">&#91;C&#93;</th><td class="cool_value">{{localTableData.chemistry_c}}</td>
        <th class="cool_value">&#91;Cr&#93;</th><td class="cool_value">{{localTableData.chemistry_cr}}</td>
        <th class="cool_value">&#91;Cu&#93;</th><td class="cool_value">{{localTableData.chemistry_cu}}</td>
        <th class="cool_value">&#91;Mn&#93;</th><td class="cool_value">{{localTableData.chemistry_mn}}</td>
			</tr>
			<tr>
        <th class="cool_value">[Mo]</th><td class="cool_value">{{localTableData.chemistry_mo}}</td>
        <th class="cool_value">[Nb]</th><td class="cool_value">{{localTableData.chemistry_nb}}</td>
        <th class="cool_value">[Ni]</th><td class="cool_value">{{localTableData.chemistry_ni}}</td>
        <th class="cool_value">[Si]</th><td class="cool_value">{{localTableData.chemistry_si}}</td>
        <th class="cool_value">[Ti]</th><td class="cool_value">{{localTableData.chemistry_ti}}</td>
        <th class="cool_value">[V]</th><td class="cool_value">{{localTableData.chemistry_v}}</td>
			</tr>
    </table>

    <table class="cooling-table" border="1">
      <tr>
        <th colspan="2">No.</th>
        <th v-for="item in index" :key="item">{{item}}</th>
      </tr>
      <tr>
        <th class="cool_mini_value">Spec T </th><th class="cool_mini_value">I/m2mm</th>
        <td v-for="item in index" :key="item" class="cool_mini_value">
          {{localTableData["vc_flow_top_" + item.toString().padStart(2, '0')]}}
        </td>
      </tr>
      <tr>
        <th class="cool_mini_value">Spec B </th><th class="cool_mini_value">I/m2mm</th>
        <td v-for="item in index" :key="item" class="cool_mini_value">
          {{localTableData["vc_flow_bot_" + item.toString().padStart(2, '0')]}}
        </td>
      </tr>
      <tr>
        <th class="cool_mini_value">Edge</th><th class="cool_mini_value">mm</th>
        <td v-for="item in index" :key="item" class="cool_mini_value">
          <template v-if="item<5">{{localTableData["em_pos_abs_"+item]}}</template>
        </td>
      </tr>
    </table>

    <table class="cooling-table" border="1">
      <tr>
        <th>P2Mean</th><td>{{localTableData.avg_p2}}</td>	
        <th>P2Max</th><td>{{localTableData.max_p2}}</td>
        <th>P2Min</th><td>{{localTableData.min_p2}}</td>
        <th>P2Std</th><td>{{localTableData.std_p2}}</td>
        <th>P5Mean</th><td>{{localTableData.ave_p5}}</td>	
        <th>P5Max</th><td>{{localTableData.max_p5}}</td>
        <th>P5Min</th><td>{{localTableData.min_p5}}</td>
        <th>P5Std</th><td>{{localTableData.std_p5}}</td>
      </tr>
      <tr>
        <th>FHeadTop</th><td>{{localTableData.mk_factor_head_top}}</td>
        <th>LHeadTop</th><td>{{localTableData.mk_length_head_top}}</td>
        <th>FHeadBtm</th><td>{{localTableData.mk_factor_head_btm}}</td>
        <th>LHeadBtm</th><td>{{localTableData.mk_length_head_btm}}</td>
        <th>FTailTop</th><td>{{localTableData.mk_factor_tail_top}}</td>
        <th>LTailTop</th><td>{{localTableData.mk_length_tail_top}}</td>
        <th>FTailBtm</th><td>{{localTableData.mk_factor_tail_btm}}</td>
        <th>LTailBtm</th><td>{{localTableData.mk_length_tail_btm}}</td>	
      </tr>
      <tr>
        <th>P5Prec30</th><td></td>
        <th>Key</th><td></td>
        <th>DQ Water</th><td>{{localTableData.dq_water_temp}}</td>
        <th>ACC Water</th><td>{{localTableData.acc_water_temp}}</td>
        <th>Air Temp</th><td>{{localTableData.air_temp}}</td>
        <th></th><td></td>
        <th>CRcal</th><td>{{localTableData.avg_cr_cal}}</td>
        <th>CRact</th><td>{{localTableData.avg_cr_act}}</td>
      </tr>
      <tr>
        <th rowspan="2">Adaption</th>
        <th>PRE</th><th>Date</th><td>{{localTableData.toc}}</td>
        <th>tf_last</th><td>{{localTableData.last_rolling_finish_temp}}</td>
        <th>tr_fm</th><td>{{localTableData.speed_ratio}}</td>
        <th>ts_last</th><td>{{localTableData.last_cooling_stop_temp}}</td>
        <th>vx_last</th><td>{{localTableData.last_plate_speed}}</td>
        <th>lx_last</th><td>{{localTableData.last_cooling_zone_length}}</td>
        <th>tw_last</th><td>{{localTableData.last_water_temp}}</td>	
      </tr>
      <tr>
        <th>Tap Code</th><td colspan="2">{{localTableData.tapping_code}}</td>
        <th>Plates</th><td colspan="2">{{localTableData.plate_count}}</td>
        <th>1st Plate</th><td colspan="2">{{localTableData.plate_before_1}}</td>
        <th>2nd Plate</th><td colspan="2">{{localTableData.plate_before_2}}</td>
        <th>3rd Plate</th><td colspan="2">{{localTableData.plate_before_3}}</td>
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
      localTableData: this.tableData,
      index: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
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
.cooling-table {
  width: 100%;
  margin-bottom: 15px;
  border-collapse: collapse;
}
</style>
