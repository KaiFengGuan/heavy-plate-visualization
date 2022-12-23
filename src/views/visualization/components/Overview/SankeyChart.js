import * as d3 from 'd3';
import store from '@/store';
import { dir } from '@/components/Tooltip';
import { randomString, curry } from '@/utils';
import { getLabelColor } from '../../utils';
import tooltipIns from '@/utils/tooltip';

const labelOrder = ['404', '1', '0'];   // 桑基图顺序

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
    this._allSankeyData = null;

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

    this.#renderTimeLine();

    const linkGroup = this._root.append('g')
      .attr('class', 'link-group')
    this.#renderLink(linkGroup, this._allSankeyData);

    this.#renderTooltip();
    this.#renderTimeLineBrush();

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
    this._scaleTime = d3.scaleTime(timeDomain, timeRange).nice();
  }

  #renderLink(linkGroup, linkList) {
    const { _width, _data, _padding, _scaleLabel } = this;
    const { left, right, top } = this._margin;
    
    const linkMap = new Map();
    linkList.forEach(item => linkMap.set(item.id, item))
    
    const animation = d3.transition().duration(100);
    const pathStyle = g => g
      .attr('fill', 'none')
      .attr('opacity', 0.5)
      .attr('stroke-width', id => linkMap.get(id).h)
      .attr('stroke', id => getLabelColor(linkMap.get(id).label))
    linkGroup.selectAll('.link-path')
      .data(linkMap.keys(), d => d)
      .join(
        enter => enter.append('path')
          .attr('class', 'link-path')
          .attr('d', _pathGeneration)
          .call(pathStyle),
        update => update.transition(animation)
          .attr('d', _pathGeneration),
        exit => exit.transition(animation)
          .attr('opacity', 0)
          .remove()
      )
    
    function _pathGeneration(id, idx) {
      const item = linkMap.get(id);
      const lastArr = linkList.slice(0, idx);
      const y1Offset = lastArr.reduce((a, b) => ({h: a.h + b.h}), {h: top}).h;
      const x1 = left,
        x2 = _width-right-20,
        y1 = y1Offset + item.h/2,
        y2 = item.t1H + item.h/2;
      return d3.linkHorizontal()({
        source: [x1, y1],
        target: [x2, y2]
      });
    }
    
    const labelHArr = labelOrder.map(label => {
      const hArr = linkList.filter(d => d.label === label).map(d => d.h);
      return [label, hArr.reduce((a, b) => a+b, 0)];
    })
    const hMap = new Map(labelHArr);
    const nodeH = label => hMap.get(label);
    const nodeY = (_, idx) => {
      const arr = labelOrder.slice(0, idx).map(e => hMap.get(e));
      return arr.reduce((a, b) => a + b, top);
    };
    linkGroup.selectAll('.link-node')
      .data(labelOrder, d => d)
      .join(
        enter => enter.append('rect')
          .attr('class', 'link-node')
          .attr('x', left - 5)
          .attr('width', 5)
          .attr('fill', getLabelColor)
          .attr('y', nodeY)
          .attr('height', nodeH),
        update => update.transition(animation)
          .attr('y', nodeY)
          .attr('height', nodeH),
      )
  }

  #renderTimeLine() {
    const { _width, _renderData, _scaleTime } = this;
    const { top, right, bottom } = this._margin;
    const labelCountMap = new Map([['0', []], ['1', []], ['404', []]]);
    const timeLineW = 15, spaceRight = 20;
    
    this._root.append('g')
    .selectAll('.timeLineG')
      .data(_renderData)
    .join('rect')
      .attr('class', 'time-line-block')
      .attr('width', timeLineW)
      .attr('height', d => {
        const rectBlock = this.#timelineHegiht(d);
        const { label } = rectBlock;
        labelCountMap.get(label).push(rectBlock);
        return rectBlock.h;
      })
      .attr('x', _width - right - timeLineW - spaceRight)
      .attr('y', d => _scaleTime(d[0].toc))
      .attr('fill', d => getLabelColor(d[0].label))
    
    this._root.append('g')
      .attr('transform', `translate(${_width-right-spaceRight}, 0)`)
      .style('user-select', 'none')
      .call(d3.axisRight(_scaleTime).tickSize(0))
      .call(g => g.selectAll('.tick')
        .attr('font-size', 7.5)
        .attr('font-weight', 600)
        .attr('color', '#2c2c2c'))
      .call(g => g.selectAll('.domain').remove())
    
    this._allSankeyData = labelOrder.map(d => labelCountMap.get(d)).flat();
  }

  // 根据数组元素的时间跨度计算高度，d是一个数组
  #timelineHegiht(d) {
    const { _scaleTime } = this;
    const n = d.length,
      label = d[0].label;
    let t1 = _scaleTime(d[0].toc),
      t2 = 0;
    if (n === 1) t2 = t1 + 0.5;
    else t2 = _scaleTime(d[n-1].toc);

    return {   // 这里保存的数据是画桑基图的连接线用的
      id: randomString(),
      label: label,
      h: t2 - t1,
      t1H: t1,
      t2H: t2,
      data: d
    }
  }

  #renderTimeLineBrush() {
    const that = this;
    const { _root, _width, _allSankeyData, _scaleTime } = this;
    const { top, right, bottom } = this._margin;
    const timeLineW = 15, spaceRight = 20;
    const x1 = _width - right - timeLineW - spaceRight,
      xRange = [x1, x1 + timeLineW],
      yRange = _scaleTime.range();

    const timeRect = _root.selectAll('.time-line-block');
    const brush = d3.brushY()
      .extent([[xRange[0], yRange[0]], [xRange[1], yRange[1]]])
      .on('start brush', _brushingHandle)
      .on('end', _brushEndHandle);
    _root.append('g')
      .attr('class', 'brush-group')
      .call(brush)
    
    function _brushingHandle({selection}) {
      if (selection === null) {
        timeRect.attr('opacity', 1);
        return;
      }

      timeRect.attr('opacity', d => {
        const { t1H, t2H } = that.#timelineHegiht(d);
        return t2H >= selection[0] && t1H <= selection[1] ? 1 : 0.2;
      })
    }

    function _brushEndHandle({selection}) {
      const linkGroup = _root.select('.link-group')

      if (selection === null) {
        timeRect.attr('opacity', 1);
        that.#renderLink(linkGroup, _allSankeyData);
        return;
      };

      const brushedLinkData = _allSankeyData.filter(item => item.t2H>=selection[0] && item.t1H<=selection[1]);
      const selectedUpids = brushedLinkData.map(d => d.data.map(e => e.upid)).flat();
      that.#renderLink(linkGroup, brushedLinkData);
      store.dispatch('visual/saveSelectedData', selectedUpids)
    }
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
