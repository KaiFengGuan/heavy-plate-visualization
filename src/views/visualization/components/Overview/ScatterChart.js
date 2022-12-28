import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import store from '@/store';
import { randomString, curry } from '@/utils';
import { lasso } from '@/components/Lasso';
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
    this.#renderLasso();

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

  #pointPosition(datum) {
    const { _scaleX, _scaleY } = this;
    return [_scaleX(datum.x), _scaleY(datum.y)]
  }

  #renderScatter() {
    const renderData = this._data;

    this._root.append('g')
      .attr('class', 'scatter-group')
    .selectAll('.scatter-points')
    .data(renderData)
    .join('circle')
      .attr('class', 'scatter-points')
      .attr('transform', d => `translate(${this.#pointPosition(d)})`)
      .attr('stroke', d => getLabelColor(d.label))
      .attr('fill', d => d3.color(getLabelColor(d.label)).brighter(0.8))
      .attr('r', 2)
      .attr('stroke-width', 1)
  }

  #renderTooltip() {
    const that = this;
    this._root.selectAll('.scatter-points')
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

  #renderLasso() {
    const that = this;
    const { _root, _data } = this;

    const scatterPoints = _root.selectAll('.scatter-points');
    const lassoPath = _root.append('path').attr('class', 'lasso');
    _root.append("defs").append("style").text(`
      .selected {r: 4}
      .lasso { pointer-events: none; fill-rule: evenodd; fill-opacity: 0.1; stroke-width: 1.5; stroke: #000; }
    `);

    _root.call(lasso()
      .on("start lasso end", draw)
      .on('end', function(polygon) {
        const selected = [];

        scatterPoints.classed(
          "selected",
          polygon.length > 2
            ? d => d3.polygonContains(polygon, that.#pointPosition(d)) && selected.push(d.upid)
            : false
        );
        
        if (selected.length) {
          store.dispatch('visual/saveSelectedData', selected)
        }
      })
    );


    function draw(polygon) {
      lassoPath.datum({
        type: 'LineString',
        coordinates: polygon
      }).attr('d', d3.geoPath());
  
      // const selected = polygon.length > 2 ? [] : _data;
      
      // // note: d3.polygonContains uses the even-odd rule
      // // which is reflected in the CSS for the lasso shape
      // scatterPoints.classed(
      //   "selected",
      //   polygon.length > 2
      //     ? d => d3.polygonContains(polygon, that.#pointPosition(d)) && selected.push(d)
      //     : false
      // );
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
