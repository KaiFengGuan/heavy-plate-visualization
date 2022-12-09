<template>
  <div class="condition-container">
    <div class="select-item">
      <span class="title">标签类型：</span>
      <el-select
        class="label-select"
        v-model="label"
        @change="changeRange"
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

    <div class="slider-item">
      <template v-if="condition==='size' || condition==='all'">
        <div class="item" v-for="item in sizeKeys" :key="item">
          <el-checkbox  class="title" v-model="checkStatus[item]">{{item}}:</el-checkbox>
          <el-slider
            v-model="range[item]"
            @change="changeRange"
            range
            :format-tooltip="formatTooltip"
            :min="minMaxStep[item] ? minMaxStep[item][0] : 0"
            :max="minMaxStep[item] ? minMaxStep[item][1] : 0"
            :step="minMaxStep[item] ? minMaxStep[item][2] : 0"
          >
          </el-slider>
        </div>
      </template>

      <template v-if="condition==='process' || condition==='all'">
        <div class="item" v-for="item in processKeys" :key="item">
          <el-checkbox  class="title" v-model="checkStatus[item]">{{item}}:</el-checkbox>
          <el-slider
            v-model="range[item]"
            @change="changeRange"
            range
            :format-tooltip="formatTooltip"
            :min="minMaxStep[item] ? minMaxStep[item][0] : 0"
            :max="minMaxStep[item] ? minMaxStep[item][1] : 0"
            :step="minMaxStep[item] ? minMaxStep[item][2] : 0"
          >
          </el-slider>
        </div>
      </template>

      <template v-if="condition==='steelType' || condition==='all'">
        <div class="item">
          <el-checkbox  class="title" v-model="checkStatus['steelspec']">钢种:</el-checkbox>
          <el-radio-group v-model="range.steelspec" @change="changeRange">
            <el-radio
              v-if="plateRawData.steelspec?.length"
              :label="plateRawData.steelspec"
            >{{plateRawData.steelspec}}</el-radio>
            <el-radio :label="'all'">不限制</el-radio>
          </el-radio-group>
        </div>
      </template>
    </div>
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
        tgtplatelength2: false,
        tgtwidth: false,
        tgtplatethickness: true,
        dischargetemp: false,
        tmplatetemp: false,
        cooling_start_temp: false,
        cooling_stop_temp: false,
        cooling_rate: false,
        steelspec: false
      },
      range: {
        tgtplatelength2: [0, 0],
        tgtwidth: [0, 0],
        tgtplatethickness: [0, 0],
        dischargetemp: [0, 0],
        tmplatetemp: [0, 0],
        cooling_start_temp: [0, 0],
        cooling_stop_temp: [0, 0],
        cooling_rate: [0, 0],
        steelspec: ''
      },
      minMaxStep: {},
      sizeKeys: ['tgtplatelength2', 'tgtwidth', 'tgtplatethickness'],
      processKeys: ['tgtdischargetemp', 'tgttmplatetemp', 'cooling_start_temp', 'cooling_stop_temp', 'cooling_rate1'],
      steelTypeKeys: ['steelspec']
    }
  },
  watch: {
    plateData(newVal) {
      this.plateRawData = newVal;

      const {
        tgtplatelength2,
        tgtwidth,
        tgtplatethickness,
        tgtdischargetemp,
        tgttmplatetemp,
        cooling_start_temp,
        cooling_stop_temp,
        cooling_rate1,
        steelspec
      } = newVal;

      const range = this.range;
      const rangeLimit = this.rangeLimit;
      range.tgtplatelength2 = rangeLimit([tgtplatelength2 - 1, tgtplatelength2 + 2]);
      range.tgtwidth = rangeLimit([tgtwidth - 0.5, tgtwidth + 0.2]);
      range.tgtplatethickness = rangeLimit([tgtplatethickness, tgtplatethickness + 0.1]);
      range.dischargetemp = rangeLimit([tgtdischargetemp - 100, tgtdischargetemp + 100]);
      range.tmplatetemp = rangeLimit([tgttmplatetemp - 100, tgtdischargetemp + 100]);
      range.cooling_start_temp = rangeLimit([cooling_start_temp - 100, cooling_start_temp + 100]);
      range.cooling_stop_temp = rangeLimit([cooling_stop_temp - 100, cooling_stop_temp + 100]);
      range.cooling_rate = rangeLimit([cooling_rate1 - 10, cooling_rate1 + 10]);
      range.steelspec = steelspec;
      this.changeRange();

      const sliderKeys = [...this.sizeKeys, ...this.processKeys];
      for (const key of sliderKeys) {
        this.minMaxStep[key] = this.slideMaxMinStep(key);
      }
    }
  },
  methods: {
    changeRange() {
      const data = {
        ...this.range,
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
    },
    slideMaxMinStep(key) {
      const value = this.plateRawData[key];
      const extend = value / 2;
      const min = value - extend;
      const max = value + extend;
      const step = (max - min) / 100;
      return this.rangeLimit([min, max, step]);
    },
    rangeLimit(numArr) {
      if (numArr[0] < 0) numArr[0] = 0;
      return numArr;
    },
    formatTooltip(val) {
      return val?.toFixed?.(2) ?? 0;
    }
  }
}
</script>

<style lang="scss">
.condition-container {
  color: rgba(0,0,0,.45);
  display: flex;
  flex-direction: column;

  .select-item {
    display: flex;
    margin: 15px 0 0;

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

  .slider-item {
    margin-top: 15px;
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
