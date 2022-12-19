import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import { randomString, curry } from '@/utils';
import { getLabelColor } from '../../utils';
import tooltipIns from '@/utils/tooltip';

export default class DistributionChart {
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
    console.log('分布图渲染数据', data)

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#scaleInit();

    this.#renderDistribution();
    this.#renderTooltip();

    return this;
  }

  #scaleInit() {
    // const { _width, _height, _data } = this;
    // const { left, right, top, bottom } = this._margin;
    // const xRange = [left, _width - right],
    //   yRange = [top, _height - bottom];
    // const xDomain = d3.extent(_data, d => d.x);
    // const yDomain = d3.extent(_data, d => d.y);
    
    // this._scaleX = d3.scaleLinear(xDomain, xRange);
    // this._scaleY = d3.scaleLinear(yDomain, yRange);
  }

  #renderDistribution() {
    const h = 70;
    console.log('lalala')
    this._root.selectAll('rect')
      .data(d3.range(5))
    .join('rect')
      .attr('y', (_, i) => i*h)
      .attr('width', 200)
      .attr('height', h)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
  }

  #renderTooltip() {
    // const that = this;
    // this._root.selectAll('.scatter-point')
    //   .on('mouseenter', _mouseenterHandle)
    //   .on('mouseleave', _mouseleaveHandle)

    function _mouseenterHandle(event, d) {
    }

    function _mouseleaveHandle() {
    }
  }
}
