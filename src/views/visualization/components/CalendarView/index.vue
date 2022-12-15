<template>
  <el-card class="no-header-card">
    <div class="calendar-container">
      <div class="date-select">
        <div class="title">
          <!-- Heavy plate quality trend monitoring -->
          <span>Visual</span>
        </div>
        <el-date-picker
          v-model="curMonth"
          type="month"
          placeholder="选择月"
          value-format="yyyy-MM-dd"
          style="width: 100%;"
        ></el-date-picker>
      </div>
      <div class="calendar-chart">
        <svg :id="svgId" style="width: 100%; height: 100%"></svg>
      </div>
    </div>
  </el-card>
</template>

<script>
import * as d3 from 'd3';
import { randomString } from '@/utils';
import { getNumberOfPlatesByTime } from '@/api/visualization';

import CalendarChart from './CalendarChart';
import TooltipClass from '@/components/Tooltip';

export default {
  data() {
    return {
      curMonth: this.$store.getters.curMonth,
      svgId: `calendarChart_${randomString()}`,
      chartIns: null,
      tooltipIns: null,
      calendarData: []
    }
  },
  watch: {
    curMonth(newVal) {
      this.$store.dispatch('visual/changeMonth', newVal);
      this.getData();
    },
    calendarData() {
      this.paint();
    }
  },
  created() {
    this.getData();
  },
  mounted() {
    const svg = document.getElementById(this.svgId);
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    this.chartIns = new CalendarChart({ width, height }, d3.select(svg));
    this.tooltipIns = new TooltipClass(
      { width: 0, height: 0 },
      svg.parentElement,
      `tooltip_${randomString()}`
    );
    
    if (this.calendarData.length) {
      this.paint();
    }
  },
  methods: {
    getData() {
      getNumberOfPlatesByTime(this.curMonth).then((res) => {
        const { data } = res;
        this.calendarData = Object.freeze(data);
      });
    },
    paint() {
      if (!this.chartIns) return;
      this.chartIns
        .dataInit(this.calendarData)
        .propsTooltip(this.tooltipIns)
        .render()
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-container {
  display: flex;
  height: 100%;

  .date-select {
    width: 130px;
    margin-right: 20px;
    margin-left: 10px;
    display: flex;
    flex-direction: column;

    .title {
      flex: 1;
      color: #585858;
      font-size: 1.5em;
      font-weight: bold;
      font-style: italic;
      text-align: center;
      margin: 0.8em auto;
      user-select: none;
      span {
        letter-spacing: 0.1em;
      }
    }

    .el-date-editor {
      margin-bottom: 10px;
    }
  }

  .calendar-chart {
    flex: 1;
    position: relative;
    // border: 1px solid grey;
  }
}
</style>