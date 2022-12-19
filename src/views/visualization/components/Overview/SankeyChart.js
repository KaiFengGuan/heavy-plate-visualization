import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import { randomString, curry } from '@/utils';
import { getLabelColor } from '../../utils';
import tooltipIns from '@/utils/tooltip';

export default class SankeyChart {
  constructor({
    width,
    height,
    margin={top: 10, bottom: 10, left: 10, right: 10}
  } = {}, rootNode) {
    this._width = width;
    this._height = height;
    this._margin = margin;
    this._root = rootNode;

    this._padding = 5;  // 标签间的间隔

    this._scaleLabel = null;
    this._scaleTime = null;

    this._data = null;  // 原始数据
    this._renderData = null;

    return this;
  }

  dataInit(data) {
    const d = data.map(item => {
      const time = new Date(item.toc);
      return {...item, toc: time}
    });
    d.sort((a, b) => a.toc - b.toc);
    this._data = Object.freeze(d)

    // console.log('桑基图数据', this._data)
    this._renderData = Object.freeze(this.#transToRenderData());
    // console.log('处理后数据', this._renderData)
    // console.log(this._renderData.filter(d => d.length === 1))

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#scaleInit();

    const labelCountMap = this.#renderTimeLine();
    this.#renderLink(labelCountMap);
    this.#renderTooltip();

    return this;
  }

  #scaleInit() {
    const { _width, _height, _data, _padding } = this;
    const { left, right, top, bottom } = this._margin;
    const labelRange = [0, _height - top - bottom - _padding*2],
      timeRange = [top, _height - bottom];
    const labelDomain = [0, _data.length];
    const timeDomain = d3.extent(_data, d => d.toc);
    
    this._scaleLabel = d3.scaleLinear(labelDomain, labelRange);
    this._scaleTime = d3.scaleTime(timeDomain, timeRange);
  }

  #renderLink(labelCountMap) {
    const { _width, _data, _padding, _scaleLabel } = this;
    const { left, right, top } = this._margin;
    const labelOrder = ['404', '1', '0'];
    // console.log(labelCountMap)

    const linkGroup = this._root.append('g');
    
    linkGroup.selectAll('.labelG')
      .data(labelOrder)
      .join('g')
    .selectAll('.link-path')
    .data(d => labelCountMap.get(d))
    .join('path')
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .attr('stroke-width', d => d.h)
      .attr('stroke', d => getLabelColor(d.label))
      .attr('d', (d, i) => {
        const { label } = d;
        const labelIdx = labelOrder.indexOf(label);
        const lastHArr = labelOrder.slice(0, labelIdx).map(d => labelCountMap.get(d)),
          currHArr = labelCountMap.get(label).slice(0, i);
        const allArr = [...lastHArr, currHArr].flat();
        const y1Offset = allArr.reduce((a, b) => ({h: a.h + b.h}), {h: top}).h;

        const x1 = left,
          x2 = _width-right-20,
          y1 = y1Offset + d.h/2,
          y2 = d.t1H + d.h/2;
        return d3.linkHorizontal()({ source: [x1, y1], target: [x2, y2] });
      })
    
    linkGroup.selectAll('.left-node')
      .data(labelOrder)
    .join('rect')
      .attr('fill', d => getLabelColor(d))
      .attr('x', left-5)
      .attr('y', (d, i) => {
        const labelIdx = labelOrder.indexOf(d);
        const lastHArr = labelOrder.slice(0, labelIdx).map(d => labelCountMap.get(d));
        const hOffset = lastHArr.flat().map(d => d.h).reduce((a, b) => a + b, top);
        return hOffset;
      })
      .attr('width', 5)
      .attr('height', d => {
        return labelCountMap.get(d).map(d => d.h).reduce((a, b) => a + b, 0)
      })
  }

  #renderTimeLine() {
    const { _width, _renderData, _scaleTime } = this;
    const { top, right, bottom } = this._margin;
    const labelCountMap = new Map([['0', []], ['1', []], ['404', []]]);
    const timeLineW = 10, spaceRight = 20;
    
    this._root.append('g')
    .selectAll('.timeLineG')
      .data(_renderData)
    .join('rect')
      .attr('width', timeLineW)
      .attr('height', d => {
        const n = d.length,
          label = d[0].label;
        let rectH = 0, t1 = 0, t2 = 0;
        if (n === 1) rectH = 0.5;
        else {
          t1 = _scaleTime(d[0].toc);
          t2 = _scaleTime(d[n-1].toc);
          rectH = t2 - t1;
        }
        labelCountMap.get(label).push({   // 这里保存的数据是画桑基图的连接线用的
          label: label,
          h: rectH,
          t1H: t1 !== 0 ? t1 : _scaleTime(d[0].toc),
          t2H: t2 !== 0 ? t2 : _scaleTime(d[0].toc)+0.5
        });
        return rectH;
      })
      .attr('x', _width - right - timeLineW - spaceRight)
      .attr('y', d => _scaleTime(d[0].toc))
      .attr('fill', d => getLabelColor(d[0].label))
    
      this._root.append('g')
        .attr('transform', `translate(${_width-right-spaceRight}, 0)`)
        .call(d3.axisRight(_scaleTime.nice()).tickSize(0))
        .call(g => g.selectAll('.tick')
          .attr('font-size', 7.5)
          .attr('font-weight', 600)
          .attr('color', '#2c2c2c'))
        .call(g => g.selectAll('.domain').remove())
    
    return labelCountMap;
  }

  #renderTooltip() {
    // const that = this;
    // this._root.selectAll('.scatter-point')
    //   .on('mouseenter', _mouseenterHandle)
    //   .on('mouseleave', _mouseleaveHandle)

    function _mouseenterHandle(event, d) {
      // const { toc, upid, label, steelspec } = d;
      // const content = [
      //   `date: ${toc}`,
      //   `upid: ${upid}`,
      //   `steelspec: ${steelspec}`
      // ];

      // that.#setPointSize(d3.select(this));
      // tooltipIns && tooltipIns.showTooltip({
      //   id: randomString(),
      //   direction: dir.up,
      //   x: event.pageX,
      //   y: event.pageY,
      //   content: content,
      //   stroke: getLabelColor(label)
      // });
    }

    function _mouseleaveHandle() {
      // that.#resetPointSize(d3.select(this));
      // tooltipIns && tooltipIns.removeTooltip();
    }
  }

  #transToRenderData() {
    const largeInterval = (a, b) => {
      const t = (b.getTime() - a.getTime()) / 1000 / 60;  // min
      return t > 30;
    }
    const data = this._data;
    const newData = [];
    let temp = [];
    let pre = null;
    for (const item of data) {
      if (pre && (pre.label !== item.label || largeInterval(pre.toc, item.toc))) {
        newData.push(temp);
        temp = [];
      }
      temp.push(item);
      pre = item;
    }
    
    return newData;
  }
}
