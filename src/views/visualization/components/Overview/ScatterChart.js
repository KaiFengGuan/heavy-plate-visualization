import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import { randomString, curry } from '@/utils';
import { getLabelColor } from '../../utils';
import tooltipIns from '@/utils/tooltip';

export default class ScatterChart {
  constructor({
    width,
    height,
    margin={top: 10, bottom: 10, left: 10, right: 10}
  } = {}, rootNode) {
    this._width = width;
    this._height = height;
    this._margin = margin;
    this._root = rootNode;

    this._scaleX = null;
    this._scaleY = null;

    this._data = null;  // 原始数据

    return this;
  }

  dataInit(data) {
    this._data = data;
    // console.log('散点图渲染数据', data)

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#scaleInit();

    this.#renderScatter();
    this.#renderTooltip();

    return this;
  }

  #scaleInit() {
    const { _width, _height, _data } = this;
    const { left, right, top, bottom } = this._margin;
    const xRange = [left, _width - right],
      yRange = [top, _height - bottom];
    const xDomain = d3.extent(_data, d => d.x);
    const yDomain = d3.extent(_data, d => d.y);
    
    this._scaleX = d3.scaleLinear(xDomain, xRange);
    this._scaleY = d3.scaleLinear(yDomain, yRange);
  }

  #renderScatter() {
    const renderData = this._data;
    const { _scaleX, _scaleY } = this;

    this._root.append('g')
    .selectAll('.scatter-point')
    .data(renderData)
    .join('circle')
      .attr('class', 'scatter-point')
      .attr('cx', d => _scaleX(d.x))
      .attr('cy', d => _scaleY(d.y))
      .attr('r', 2)
      .attr('stroke-width', 1)
      .attr('stroke', d => getLabelColor(d.label))
      .attr('fill', d => d3.color(getLabelColor(d.label)).brighter(0.8))
  }

  #renderTooltip() {
    const that = this;
    this._root.selectAll('.scatter-point')
      .on('mouseenter', _mouseenterHandle)
      .on('mouseleave', _mouseleaveHandle)

    function _mouseenterHandle(event, d) {
      const { toc, upid, label, steelspec } = d;
      const content = [
        `date: ${toc}`,
        `upid: ${upid}`,
        `steelspec: ${steelspec}`
      ];

      that.#setPointSize(d3.select(this));
      tooltipIns && tooltipIns.showTooltip({
        id: randomString(),
        direction: dir.up,
        x: event.pageX,
        y: event.pageY,
        content: content,
        stroke: getLabelColor(label)
      });
    }

    function _mouseleaveHandle() {
      that.#resetPointSize(d3.select(this));
      tooltipIns && tooltipIns.removeTooltip();
    }
  }

  #setPointOpacity() {
    
  }

  #resetPointOpacity() {

  }

  #setPointSize(selection) {
    selection
      .attr('r', 5)
      .attr('stroke-width', 2)
  }

  #resetPointSize(selection) {
    selection
      .attr('r', 2)
      .attr('stroke-width', 1)
  }
}
