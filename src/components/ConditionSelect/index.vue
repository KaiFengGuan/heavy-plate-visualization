<template>
  <div class="condition-container">
    <div class="select-item">
      <span class="title">标签类型：</span>
      <el-select
        class="label-select"
        v-model="label"
        @change="changeLabelSelect"
        placeholder="选择标签类型"
      >
        <el-option
          v-for="item in labelOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div class="select-item">
      <span class="title">规格类型：</span>
      <el-select class="condition-select" v-model="condition" placeholder="选择规格条件">
        <el-option
          v-for="item in conditionOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <template v-if="condition==='size' || condition==='all'">
      <div class="item" v-for="item in Object.keys(sizeData)" :key="item">
        <el-checkbox  class="title" v-model="checkStatus[item]">{{item}}:</el-checkbox>
        <el-slider
          v-model="sizeData[item]"
          @change="changeSize"
          range
          :max="10">
        </el-slider>
      </div>
    </template>

    <template v-if="condition==='process' || condition==='all'">
      <div class="item" v-for="item in Object.keys(processData)" :key="item">
        <el-checkbox  class="title" v-model="checkStatus[item]">{{item}}:</el-checkbox>
        <el-slider
          v-model="processData[item]"
          @change="changeProcess"
          range
          :max="100">
        </el-slider>
      </div>
    </template>

    <template v-if="condition==='steelType' || condition==='all'">
      <div class="item">
        <el-checkbox  class="title" v-model="checkStatus['steelspec']">钢种:</el-checkbox>
        <el-radio-group v-model="steelTypeData.steelspec" @change="changeSteelType">
          <el-radio
            v-if="plateRawData.steelspec?.length"
            :label="plateRawData.steelspec"
          >{{plateRawData.steelspec}}</el-radio>
          <el-radio :label="'all'">不限制</el-radio>
        </el-radio-group>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    plateData: {
      type: Object
    }
  },
  data() {
    const opts = [
      { value: 'size', label: '尺寸' },
      { value: 'process', label: '工艺' },
      { value: 'steelType', label: '钢种' },
      { value: 'all', label: '全部' },
    ];
    const opts2 = [
      { value: 'good', label: '无故障钢板' },
      { value: 'all', label: '所有钢板' }
    ];

    return {
      conditionOptions: opts,
      condition: opts[0].value,
      labelOptions: opts2,
      label: opts2[0].value,
      plateRawData: {},   // 钢板规格初始数据
      checkStatus: {
        length: false,
        width: false,
        thick: true,
        dischargetemp: false,
        tmplatetemp: false,
        cooling_start_temp: false,
        cooling_stop_temp: false,
        cooling_rate: false,
        steelspec: false
      },
      sizeData: {
        length: [0, 0],
        width: [0, 0],
        thick: [0, 0]
      },
      processData: {
        dischargetemp: [0, 0],
        tmplatetemp: [0, 0],
        cooling_start_temp: [0, 0],
        cooling_stop_temp: [0, 0],
        cooling_rate: [0, 0]
      },
      steelTypeData: {
        steelspec: 'X80M'
      }
    }
  },
  watch: {
    plateData(newVal) {
      this.plateRawData = newVal;

      const {
        tgtplatelength2,
        tgtwidth,
        tgtplatethickness
      } = newVal;
      this.sizeData = {
        length: [tgtplatelength2 - 10, tgtplatelength2 + 10],
        width: [tgtwidth - 5, tgtwidth + 5],
        thick: [tgtplatethickness - 0.1, tgtplatethickness + 0.1]
      };

      const {
        tgtdischargetemp,
        tgttmplatetemp,
        cooling_start_temp,
        cooling_stop_temp,
        cooling_rate1
      } = newVal;
      this.processData = {
        dischargetemp: [tgtdischargetemp - 10, tgtdischargetemp + 10],
        tmplatetemp: [tgttmplatetemp - 10, tgtdischargetemp + 10],
        cooling_start_temp: [cooling_start_temp - 10, cooling_start_temp + 10],
        cooling_stop_temp: [cooling_stop_temp - 10, cooling_stop_temp + 10],
        cooling_rate: [cooling_rate1 - 10, cooling_rate1 + 10]
      };

      const { steelspec } = newVal;
      this.steelTypeData = { steelspec: steelspec };
    }
  },
  methods: {
    changeSize() {
      this.emitData();
    },
    changeProcess() {
      this.emitData();
    },
    changeSteelType() {
      this.emitData();
    },
    changeLabelSelect() {
      this.emitData();
    },
    emitData() {
      const data = {
        ...this.sizeData,
        ...this.processData,
        ...this.steelTypeData,
        label: this.label
      };
      const status = this.checkStatus;
      for (let key of Object.keys(status)) {
        
        if (!status[key]) {
          if (key === 'steelspec') data[key] = '';
          else data[key] = [];
        }
      }
      this.$emit('changeData', data);
    }
  }
}
</script>

<style lang="scss">
.condition-container {
  color: rgba(0,0,0,.45);

  .select-item {
    display: flex;
    margin: 15px 0;

    .title {
      font-size: 16px;
      font-weight: 700;
      line-height: 40px;
    }

    .el-select {
      margin-left: 5px;
      flex-grow: 1;
    }
  }

  .item {
    padding: 5px 5px 20px 15px;

    .el-slider__button-wrapper {
      top: -5px;

      .el-slider__button {
        border-radius: 0%;
        width: 0;
        height: 0;
        border-bottom: 12px solid #409EFF;
        border-left: 4px solid transparent;
        border-right: 4px solid transparent;
        border-top-color: transparent;
        background-color: transparent;
      }
    }

    .title {
      font-style: italic;
      font-weight: 600;
    }

    .el-radio-group {
      display: block;
      margin: 10px 0;
    }
  }
}
</style>
