import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import tooltipIns from '@/utils/tooltip';
import { randomString, curry } from '@/utils';
import { visualColor } from '../../utils';

/**
 * js 的 Date对象的 getDay 方法返回一个数字
 * 0 表示星期天，其余依次表示星期一到六
 */
const WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class CalendarChart {
  constructor({
    width,
    height,
    margin={top: 20, bottom: 10, left: 10, right: 10}
  } = {}, rootNode) {
    this._width = width;
    this._height = height;
    this._margin = margin;
    this._root = rootNode;
    this._cellSize = { w: 20, h: 15};   // 日历格子尺寸

    this._weekX = null;
    this._weekY = null;
    this._colorScale = null;
    this._colorScaleY = null;

    this._data = null;  // 原始数据
    this._renderData = null;

    return this;
  }

  dataInit(data) {
    this._data = data;
    this._renderData = new Array();

    let row = 1;
    for (let i = 0; i < this._data.length; i++) {
      const item = this._data[i];
      const week = WEEK[new Date(item.date).getDay()];

      this._renderData.push(Object.freeze({
        ...item,
        x: week,
        y: row
      }));
      if (week === 'Sun') row += 1;
    }

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#scaleInit();

    this.#renderWeek();
    this.#renderCalendar();
    this.#renderLegend();
    this.#renderTooltip();

    return this;
  }

  #scaleInit() {
    const { left, top } = this._margin;
    const { w, h } = this._cellSize;
    const week = [...WEEK.slice(1), WEEK[0]],  // 星期天放最后面
      weekNums = d3.range(1, 7);  // [1, 7)
    const xRange = [left, left + w * week.length],
      yRange = [top, top + h * weekNums.length];
    // const lowerColor = d3.color('#F6EFA6'),  // echarts颜色
    //   upperColor = d3.color('#BF444C');
    // const lowerColor = d3.color(visualColor.good),
    //   upperColor = d3.color(visualColor.bad);
    const lowerColor = d3.color('#FFF7E8'),
      upperColor = d3.color(visualColor.bad);
    
    this._weekX = d3.scaleBand(week, xRange);
    this._weekY = d3.scaleBand(weekNums, yRange);   // 一个月最多占6周
    this._colorScale = d3.interpolate(lowerColor, upperColor);
  }

  #renderWeek() {
    const { w } = this._cellSize;
    const week = [...WEEK.slice(1), WEEK[0]];
    this._root.append('g')
    .selectAll('text')
    .data(week)
    .join('text')
      .attr('transform', d => `translate(${this._weekX(d)+w/2}, 12)`)
      .text(d => d)
      .attr('font-size', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', d3.rgb(0, 0, 0, 0.8))
  }

  #renderCalendar() {
    const colorScale = this._colorScale;
    const { _weekX, _weekY, _cellSize } = this;
    
    this._root.append('g')
    .selectAll('rect')
    .data(this._renderData)
    .join('rect')
      .attr('class', 'carlendar-cell')
      .attr('x', d => _weekX(d.x))
      .attr('y', d => _weekY(d.y))
      .attr('width', _cellSize.w)
      .attr('height', _cellSize.h)
      .attr('stroke', 'grey')
      .attr('stroke-width', 0.2)
      .attr('fill', d => colorScale(d.bad/d.total))
  }

  #renderLegend() {
    const cellSize = this._cellSize;
    const { right, top, bottom } = this._margin;
    const { _width, _height } = this;
    const w = 18, h = (_height - top - bottom) / 200;
    const colorScale = this._colorScale;
    const scaleY = d3.scaleLinear([0, 1], [top+cellSize.h*6, top]);
    this._colorScaleY = scaleY;

    const group = this._root.append('g')
      .attr('transform', `translate(${[_width-right-w-30, 0]})`)
    group.selectAll('rect')
    .data(d3.range(200))
    .join('rect')
      .attr('y', d => scaleY(d/200))
      .attr('width', w)
      .attr('height', h)
      .attr('fill', d => colorScale(d/200))
    
    const legendTooltip = group.append('g')
      .attr('class', 'legendTooltip')
      .attr('display', 'none')
    legendTooltip.append('circle')
      .attr('stroke', 'white')
      .attr('stroke-width', 1.5)
      .attr('r', 4)
      .attr('cx', w/2)
      .attr('fill', 'none')
    legendTooltip.append('text')
      .attr('x', w+8)
      .style('dominant-baseline', 'middle')
      .style('font-size', 12)
  }

  #displayColorPos(y, ratio) {
    const trans = d3.transition().duration(100);
    const legendTooltip = this._root.selectAll('.legendTooltip');
    legendTooltip.transition(trans).attr('display', 'block')
      .attr('transform', `translate(0, ${y})`)
    legendTooltip.select('text')
      .text(`≈${Math.round(ratio*100)}%`)
  }

  #disappearColorPos() {
    this._root.selectAll('.legendTooltip')
      .attr('display', 'none')
  }

  #renderTooltip() {
    const that = this;
    const { _cellSize } = this;
    const scaleY = this._colorScaleY;
    this._root.selectAll('.carlendar-cell')
      .on('mouseenter', _mouseenterHandle)
      .on('mouseleave', _mouseleaveHandle)

    function _mouseenterHandle(event, d) {
      const { good, bad, noflag, total, date, x, y } = d;
      const ratio = bad / total;
      d3.select(this).attr('stroke-width', 1.5);
      that.#displayColorPos(scaleY(ratio), ratio);

      const direction = y < 4 ? dir.down : dir.up;
      const xOffset = _cellSize.w/2,
        yOffset = direction === dir.down ? (10+_cellSize.h) : -2;
      const content = [
        `Date: ${date}`,
        `percent: ${(ratio * 100).toFixed(2)}%`,
        `total: ${total}`
      ];
      tooltipIns && tooltipIns.showTooltip({
        id: randomString(),
        direction,
        x: event.pageX + xOffset,
        y: event.pageY + yOffset,
        content: content,
      })
    }
    function _mouseleaveHandle() {
      d3.select(this).attr('stroke-width', 0.2);
      that.#disappearColorPos();
      tooltipIns && tooltipIns.removeTooltip();
    }
  }
}
