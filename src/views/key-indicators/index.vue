<template>
  <div>
    <!-- 日期选择 -->
    <el-date-picker
      v-model="dateRange"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions">
    </el-date-picker>

    <!-- 可视化 -->
    <el-row class="row-container">
      <el-col :span="16">
        <rhythm-visual style="height: 400px" :rhythmData="rhythmData" />
      </el-col>
      <el-col :span="8">
        <div>right chart</div>
      </el-col>
    </el-row>
    <!-- <div class="visual">
      <rhythm-visual style="width: 60%; height: 100%;" :rhythmData="rhythmData" />
      <div>right chart</div>
    </div> -->
    

    <!-- 数据报表 -->
    <el-table :data="renderTableData" border style="width: 100%">
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="slabid" label="slabid" width="120" align="center" />
      <el-table-column prop="upid" label="upid" width="120" align="center" />
      <el-table-column prop="platetype" label="platetype" width="100" align="center" />
      <el-table-column prop="steelspec" label="steelspec" width="120" align="center" />
      <el-table-column prop="tgtplatelength2" label="length" width="80" align="center" />
      <el-table-column prop="tgtwidth" label="width" width="80" align="center" />
      <el-table-column prop="tgtplatethickness" label="thick" width="80" align="center" />
      <!-- <el-table-column prop="tgtdischargetemp" label="出炉温度" width="80" align="center" /> -->
      <!-- <el-table-column prop="tgttmplatetemp" label="轧制温度" width="80" align="center" /> -->
      <!-- <el-table-column prop="cooling_start_temp" label="开冷温度" width="80" align="center" /> -->
      <!-- <el-table-column prop="cooling_stop_temp" label="终冷温度" width="80" align="center" /> -->
      <!-- <el-table-column prop="cooling_rate1" label="冷却率" width="80" align="center" /> -->
      <el-table-column prop="heatingDuration" label="加热时长" width="80" align="center" />
      <el-table-column prop="rollingDuration" label="轧制时长" width="80" align="center" />
      <el-table-column prop="coolingDuration" label="冷却时长" width="80" align="center" />
      <el-table-column label="板形缺陷" width="120" align="center" >
        <template slot-scope="{ row }">
          <plate-shape :fault="row.fault" :upid="row.upid" />
        </template>
      </el-table-column>
      <el-table-column prop="detail" label="detail" width="80" align="center">
        <template slot-scope="{ row }">
          <jump-to-analysis :upid="row.upid" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 报表分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paginationOption.currentPage"
      :page-sizes="paginationOption.pageSizes"
      :page-size="paginationOption.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="paginationOption.total">
    </el-pagination>
  </div>
</template>

<script>
import { getKeyIndicatorsList, getRhythmData } from '@/api/dataOverview';

import PlateShape from './components/PlateShape';
import JumpToAnalysis from './components/JumpToAnalysis';
import RhythmVisual from './components/RhythmVisual';

export default {
  components: {
    PlateShape,
    JumpToAnalysis,
    RhythmVisual
  },
  data() {
    return {
      keyIndicatorsList: [],
      rhythmData: [1,2,3],
      dateRange: '',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      paginationOption: {
        currentPage: 1,
        pageSizes: [10, 20, 30, 40],
        pageSize: 10,
        total: 0
      }
    }
  },
  computed: {
    renderTableData() {
      const { currentPage, pageSize } = this.paginationOption;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      return this.keyIndicatorsList.slice(start, end);
    }
  },
  watch: {
    dateRange: function(oldVal, newVal) {
      console.log('change dateRange: ', oldVal, newVal)
    }
  },
  created() {
    this.getData();
  },
  methods: {
    getData () {
      getRhythmData().then(res => {
        const { data } = res;
        this.rhythmData = Object.freeze(data);
        console.log('rhythmData: ', this.rhythmData)
      });

      getKeyIndicatorsList().then(res => {
        const { code, data } = res;
        if (code !== 0) {
          console.error('getKeyIndicatorsList error')
          return;
        } else {
          this.keyIndicatorsList = Object.freeze(data);
          this.paginationOption.total = this.keyIndicatorsList.length;
          console.log('keyIndicatorsList: ', this.keyIndicatorsList)
        }
      });
    },
    handleSizeChange(val) {
      this.paginationOption.pageSize = val;
    },
    handleCurrentChange(val) {
      this.paginationOption.currentPage = val;
    }
  }
}
</script>

<style lang="scss" scoped>
.visual {
  display: flex;
  height: 400px;
}
// .row-container {
//   height: 400px;
//   .el-col {
//     height: 100%;
//   }
// }
</style>
