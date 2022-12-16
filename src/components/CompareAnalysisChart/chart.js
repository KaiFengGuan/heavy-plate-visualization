import * as d3 from 'd3';
import { dir } from '../Tooltip';
import { randomString, curry } from '@/utils';
import compare_warning from '@/assets/icon/compare_warning.svg';
import compare_error from '@/assets/icon/compare_error.svg';
import tooltipIns from '@/utils/tooltip';

const overType = {
  normal: 'normal',
  warning: 'warning',
  overlimit: 'overlimit'
}
const color = {
  normal: '#06bb9a',
  warning: '#f4b919',   // #ec8648  #f4b919
  overlimit: '#f84d4d'
}

export default class CompareChart {
  constructor({
    width,
    height,
    margin={top: 65, bottom: 20, left: 60, right: 20}
  } = {}, rootNode) {
    this._width = width;
    this._height = height;
    this._margin = margin;
    this._root = rootNode;

    this._xScale = null;
    this._yScale = null;
    this._xBendScale = null;

    this._data = null;  // 原始数据
    this._dataMap = new Map(); // 映射数据, key为xData, value为该点的对应数据（tooltip使用）
    this._deviation = { // 偏差数据
      avg: [],          // 测量值偏离平均值
      std: [],          // 测量值偏离方差
      minMax: [],       // 测量值偏离最大最小值
    };
    this._overLimit = []; // 超限数据

    return this;
  }

  dataInit(data) {
    this._data = data;

    const overData = (val, lower, upper) => {
      if (val > upper || val < lower) return val - upper;
      else if (val < lower) return val - lower;
      else return 0;
    }

    const { xData, yData, avg, std, min, max } = data;
    const n = yData.length;
    for (let i = 0; i < n; i++) {
      this._deviation.avg[i] = yData[i] - avg[i];   // 观测值偏离平均值

      const upperStd = avg[i] + std[i], lowerStd = avg[i] - std[i];
      const stdDev = overData(yData[i], lowerStd, upperStd);  // 观测值偏离方差
      this._deviation.std[i] = stdDev;
      
      const minMaxDev = overData(yData[i], min[i], max[i]);   // 观测值偏离最值
      this._deviation.minMax[i] = minMaxDev;

      const temp = {
        index: i,
        xData: xData[i],
        yData: yData[i],
        min: min[i],
        max: max[i],
        upperStd: avg[i] + std[i],
        lowerStd: avg[i] - std[i],
        avg: avg[i],
        displayIcon: false,
        type: overType.normal
      };

      if (stdDev !== 0 || minMaxDev !== 0) {
        if (stdDev !== 0) temp.type = overType.warning;
        if (minMaxDev !== 0) temp.type = overType.overlimit;
        this._overLimit.push(temp);
      }

      this._dataMap.set(xData[i], temp);
    }

    let prev = null;
    for (const item of this._overLimit) {
      if (!prev) {
        item.displayIcon = true;
      } else if (item.index - 1 > prev.index || item.type !== prev.type) {
        item.displayIcon = true;
      }
      prev = item;
    }

    console.log('准备绘图：', this._data, this._deviation, this._overLimit)
    return this;
  }

  render() {
    this.#scaleInit();

    this.#renderLine();
    this.#renderArea();
    this.#renderAxis();

    this.#renderLimit();
    this.#renderTitle();

    this.#renderTooltip();
  }

  #scaleInit() {
    const data = this._data,
      xExtent = d3.extent(data.xData),
      yExtent = d3.extent(data.yData),
      devExtent = d3.extent(this._deviation.avg),
      maxMax = Math.max(...data.max);
    const xDomain = [...xExtent],
      yDomain = [yExtent[0] - devExtent[1], Math.max(yExtent[1], maxMax)],
      xRange = [this._margin.left, this._width - this._margin.right],
      yRange = [this._height - this._margin.bottom, this._margin.top];

    this._xScale = d3.scaleLinear(xDomain, xRange);
    this._yScale = d3.scaleLinear(yDomain, yRange);
    this._xBendScale = d3.scaleBand(data.xData, xRange).padding(0);
  }

  #renderTitle() {
    const titleSize = 20;
    const titleGroup = this._root.append('g')
      .attr('transform', `translate(${[25, titleSize + 5]})`)
    titleGroup.append('text')
      .text(this._data.name)
      .attr('text-anchor', 'start')
      .attr('font-size', titleSize)
      .attr('font-weight', 700)
      .attr('font-style', 'italic')
      .attr('fill', 'rgba(0, 0, 0, 0.8)')
    const box = titleGroup.node().getBBox();
    console.log(box)
    const { width } = box;
    titleGroup.append('line')
      .attr('transform', 'translate(0, 6)')
      .attr('x2', width + 30)
      .attr('stroke', 'rgba(0, 0, 0, 0.25)')
      .attr('stroke-width', 1)
  }

  #renderAxis() {
    const margin = this._margin,
      yExtent = d3.extent(this._data.yData);
    const xAxis = d3.axisBottom(this._xScale).ticks(this._width / 80).tickSizeOuter(0);
    const yAxis = d3.axisLeft(this._yScale).ticks(this._height / 40);

    const axisGroup = this._root.append('g')
      .attr('class', 'axis-group');
    
    axisGroup.append("g")
      .attr("transform", `translate(0, ${this._yScale(yExtent[0])})`)
      .call(xAxis)
    
    axisGroup.append("g")
      .attr("transform", `translate(${this._margin.left}, 0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
        .attr("x2", this._width - margin.left - margin.right)
        .attr("stroke-opacity", 0.1))
    
    const nameSize = 15;
    const yNameX = nameSize + 5,
      yNameY = this._height/2;
    const xNameX = this._width/2,
      xNameY = this._height - nameSize/2;
    _axisName(axisGroup, 'Temperature', { x: yNameX, y: yNameY, angle: -90 });
    _axisName(axisGroup, 'Position', { x: xNameX, y: xNameY });
    
    function _axisName(group, name, {x=0, y=0, angle=0}={}) {
      group.append('g')
        .attr('class', 'axis-name')
        .attr('transform', `translate(${[x, y]})`)
      .append('text')
        .attr('transform', `rotate(${angle})`)
        .attr("fill", "currentColor")
        .attr("text-anchor", "middle")
        .attr('font-size', nameSize)
        .text(name)
    }
  }

  #renderLine() {
    const lineGroup = this._root.append('g')
      .attr('class', 'line-group');

    const line = d3.line()
      .x(d => this._xScale(d.x))
      .y(d => this._yScale(d.y));
    const { xData, yData, min, max, std, avg } = this._data;
    const lineData = xData.map((d, i) => ({ x: d, y: yData[i] }));
    lineGroup.append('path')
      .attr('d', line(lineData))
      .attr('fill', 'none')
      .attr('stroke', color.overlimit)
      .attr('stroke-width', 2)
  }

  #renderArea() {
    const areaGroup = this._root.append('g')
      .attr('class', 'area-group');

    const { xData, yData } = this._data;
    const { avg, minMax, std } = this._deviation;
    const path = _renderPath.bind(this, areaGroup, yData[0], xData);
    path(avg, color.normal);
    path(std, color.warning);
    path(minMax, color.overlimit);

    function _renderPath(group, basis, xData, yData, color) {
      const line = d3.line()
        .curve(d3.curveCardinal)
        .x(d => this._xScale(d.x))
        .y(d => this._yScale(d.y));
      const list = xData.map((d, i) => ({ x: d, y: basis + yData[i] }));
      list.unshift({ x: xData[0], y: basis });
      list.push({ x: xData[xData.length - 1], y: basis });
      group.append('path')
        .attr('d', line(list))
        .attr('fill', color)
    }
  }

  #renderLimit() {
    const limitStyle = {
      colorWarning: color.warning,
      colorLimit: color.overlimit,
      lineWidth: 1
    }
    const limitItem = this._root.append('g')
      .attr('class', 'limit-group')
    .selectAll('.limit-item')
      .data(this._overLimit)
    .join('g')
      .attr('transform', d => `translate(${this._xScale(d.xData)}, 0)`)
    
    // 竖线
    limitItem.append('line')
      .attr('y1', d => this._yScale(d.min))
      .attr('y2', d => this._yScale(d.max))
      .call(_lineStyle)

    // 均值
    limitItem.append('circle')
      .attr('transform', d => `translate(0, ${this._yScale(d.avg)})`)
      .attr('r', 1.5)
      .attr('fill', 'white')
      .call(_lineStyle)
    
    // 最大最小阈值、方差
    const threshold = _renderThreshold.bind(this, limitItem);
    threshold('min');
    threshold('max');
    threshold('upperStd');
    threshold('lowerStd');

    // 警示图标
    const iconWidth = 15;
    limitItem.append('image')
      .attr('display', d => d.displayIcon ? '' : 'none')
      .attr('width', iconWidth)
      .attr('height', iconWidth)
      .attr('transform', `translate(${[-iconWidth/2, this._margin.top-iconWidth-5]})`)
      .attr('href', d => {
        if (d.type === overType.warning) return compare_warning;
        else if (d.type === overType.overlimit) return compare_error;
      })

    function _renderThreshold(group, key) {
      const halfWidth = 4;
      group.append('line')
        .attr('x1', -halfWidth)
        .attr('x2', halfWidth)
        .attr('y1', d => this._yScale(d[key]))
        .attr('y2', d => this._yScale(d[key]))
        .call(_lineStyle)
    }
    function _lineStyle(g) {
      return g.attr('stroke', d => {
        if (d.type === overType.warning) return limitStyle.colorWarning;
        else if (d.type === overType.overlimit) return limitStyle.colorLimit;
        else return 'none';
      })
        .attr('stroke-width', limitStyle.lineWidth)
    }
  }

  #renderTooltip() {
    const tooltipGroup = this._root.append('g')
      .attr('class', 'tooltip-group');
  
    const that = this;
    const { xData } = this._data;
    const { _margin, _width, _tooltip } = this;
    const bandWidth = (_width-_margin.left-_margin.right) / xData.length * 0.9;
    tooltipGroup.append('g')
      .attr('fill', '#ccc')
    .selectAll('rect')
    .data(xData)
    .join('rect')
      .attr('x', d => this._xScale(d) - bandWidth/2)
      .attr('y', this._margin.top - 25)
      .attr('height', i => this._height - this._margin.top - this._margin.bottom + 25)
      .attr('width', bandWidth)
      .attr('opacity', 0)
      .on('mouseenter', _mouseenterHandle)
      .on('mouseleave', _mouseleaveHandle)

    function _mouseenterHandle(event, d) {
      d3.select(this).attr('opacity', 0.4);
      const data = that._dataMap.get(d);
      let tooltipColor;
      if (data.type === overType.normal) tooltipColor = color.normal;
      else if (data.type === overType.warning) tooltipColor = color.warning;
      else tooltipColor = color.overlimit;
      const contentArr = [
        `position: ${data.xData}`,
        `状态: ${data.type}`,
        `观测值: ${data.yData}`,
        `最大值: ${data.max}`,
        `上方差: ${data.upperStd}`,
        `平均值: ${data.avg}`,
        `下方差: ${data.lowerStd}`,
        `最大值: ${data.min}`
      ];
      tooltipIns && tooltipIns.showTooltip({
        id: contentArr.join(';'),
        direction: dir.up,
        // x: that._xScale(data.xData),
        // y: event.offsetY - 2,
        x: event.pageX,
        y: event.pageY,
        content: contentArr,
        fontSize: '14px',
        color: tooltipColor,  // '#576270'
        stroke: tooltipColor
      })
    }
    function _mouseleaveHandle() {
      d3.select(this).attr('opacity', 0);
      tooltipIns && tooltipIns.removeTooltip();
    }
  }
}
