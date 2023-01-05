import * as d3 from 'd3';
import { updateElement, translate } from '@/utils/selection';
import { keysName, processName } from '../../utils';
import { cellAttr, formatStartEnd } from './utils';
import { horizon, river } from './BaseChart';

export default class IndicatorChart {
  constructor(group) {
    this._root = group; // 挂载的根节点

    this._data = null;
    this._diagMap = new Map();    // 每个钢板的每个工序的诊断结果
    this._groupMap = new Map();   // 每个钢板的每个工序的group
    this._foldState = [false, true, false];   // 各工序展开折叠状态
    
    return this;
  }

  dataInit(data) {
    this._data = data;
    data.forEach(item => {
      const diag = [];
      const { upid, toc, steelspec, label, diagnosis } = item;
      for (const process of keysName) {
        const temp = [];
        for (const key of process) {
          const datum = item.diagnosis[key];
          temp.push(datum);
        }
        diag.push(temp);
      }

      this._diagMap.set(item.upid, {
        upid, toc, steelspec, label,
        diagnosis: diag
      });
      this._groupMap.set(item.upid, []);
    })

    // console.log('IndicatorChart: ', this._diagMap)

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#renderNames();
    this.#renderLabel();
    this.#renderCell();

    return this;
  }

  #renderCell() {
    const that = this;
    const { _root, _foldState, _data, _diagMap, _groupMap } = this;
    const { fold_h, fold_w, open_h, open_w } = cellAttr;

    for (let i = 0; i < _data.length; i++) {
      const { upid } = _data[i];
      const datum = _diagMap.get(upid).diagnosis;
      let xOffset = this.#labelWidth();
      for (let j = 0; j < datum.length; j++) {
        // const xPrev = datum.slice(0, j).map(d => d.length).reduce((a, b) => a + b, 0);
        const g = _root.append('g')
          // .attr('transform', translate(xOffset, (_foldState[j] ? open_h : fold_h)*i))
          .attr('transform', translate(xOffset, fold_h*i))
          .attr('id', `${upid}_${j}`)
        
        _foldState[j]
          ? this.#renderOpenCell(g, datum[j])
          : this.#renderFoldCell(g, datum[j])
        // this.#renderFoldCell(g, datum[j]);

        // _foldState[j]
        //   ? xOffset += open_w * keysName[j].length
        //   : xOffset += fold_w * keysName[j].length;
        xOffset += keysName[j].length * (_foldState[j] ? open_w : fold_w);
        _groupMap.get(upid)[j] = g;
      }
    }
  }

  #renderFoldCell(group, data) {
    const color = (d) => {
      if (d.value >= d.u) return ['red', d.value - d.u]
      else if (d.value <= d.l) return ['blue', d.l - d.value]
      else return ['white', 1]
    }
    const { fold_h, fold_w } = cellAttr;
    group.selectAll('.indicator')
      .data(data)
      .join('rect')
      .attr('width', fold_w)
      .attr('height', fold_h)
      .attr('x', (d, i) => fold_w*i)
      .attr('fill', d => color(d)[0])
      .attr('opacity', d => color(d)[1])
  }

  #renderOpenCell(group, data) {
    const { fold_h, open_h, open_w } = cellAttr;
    horizon(group, data, {
      x: d => d.name,
      y: d => d.value,
      height: fold_h,
      bands: 7,
      yDomain: [0, 1]
    })
  }

  #renderNames() {
    const { _root, _foldState, _data, _diagMap, _groupMap } = this;
    const { fold_h, fold_w, open_h, open_w } = cellAttr;
    const namesMap = [];

    const g = _root.append('g');
    let xOffset = this.#labelWidth();
    for (let i = 0; i < 3; i++) {
      const nameG = g.append('g');

      _foldState[i]
        ? this.#renderOpenName(nameG, keysName[i], xOffset, 0)
        : this.#renderFoldName(nameG, processName[i], xOffset, 0)
      // this.#renderFoldName(nameG, processName[i], xOffset, 0);
      
      // _foldState[i]
      //   ? xOffset += open_w * keysName[i].length
      //   : xOffset += fold_w * keysName[i].length;
      xOffset += keysName[i].length * (_foldState[i] ? open_w : fold_w);
      namesMap[i] = nameG;
    }
  }

  #renderFoldName(group, data, x, y) {
    group.append('text')
      .text(data)
      .attr('transform', translate(x, y))
      .attr('font-size', 12)
  }

  #renderOpenName(group, data, x, y) {
    group.attr('transform', translate(x, y));
    group.selectAll('text')
      .data(data)
      .join('text')
      .text(d => d)
      .attr('transform', (d, i) => `translate(${i*10}, 0) rotate(-45)`)
      .attr('font-size', 8)
  }

  #labelWidth() {
    const { open_h } = cellAttr;
    return open_h * 5;
  }

  #renderLabel() {
    const that = this;
    const { _root, _data } = this;
    const { open_h, fold_h } = cellAttr;
    
    let flag = false;
    let start = -1, end = -1;
    const gAttr = {
      transform: (_, i) => translate(0, i*fold_h),
      class: (_, i) => `upid-label-${i}`
    };
    const rectAttr = {
      width: open_h,
      height: fold_h,
      fill: 'white',
      stroke: 'red',
      x: (_, i) => open_h * i
    };
    const circleAttr = {
      class: 'clear-button',
      r: 5,
      fill: 'green',
      display: 'none'
    };
    _root.append('g')
      .selectAll('upid-label')
      .data(_data)
    .join('g')
      .call(g => updateElement(g, gAttr))
      .on('click', __clickHandle)
      .on('mouseenter mouseleave', __overHandle)
    .selectAll('labels')
      .data(d => new Array(5).fill(d.label))
      .join('rect')
      .call(g => updateElement(g, rectAttr))

    _root.append('circle')
      .call(g => updateElement(g, circleAttr))
      .on('click', __resetHandle)
    
    function __clickHandle(e, d) {
      const idx = that.#indexByUpid(d.upid);
      if (!flag) start = idx;
      else end = idx;
      
      if (start === -1 && end === -1) {
        __displayClearButton(false);
      } else {
        __displayClearButton(true);
        if (start !== -1 && end !== -1) {
          const [s, e] = formatStartEnd(start, end);
          console.log(`start: ${s}, end: ${e}, can do something!!!!`)
        }
      }

      flag = !flag;
    }
    function __overHandle(e, d) {
      if (!flag) return;

      const tempEnd = that.#indexByUpid(d.upid);
      that.#setLabelGroupState(start, tempEnd);
    }
    function __resetHandle() {
      flag = false;
      start = -1;
      end = -1;
      that.#setLabelGroupState(start, end);
      __displayClearButton(false);
    }
    function __displayClearButton(display) {
      _root.select('.clear-button').attr('display', display ? 'block' : 'none');
    }
  }

  #setLabelGroupState(start, end) {
    const { _root, _data } = this;

    if (start === -1 && end === -1) {
      _data.forEach((_, i) => __resetRectByIndex(i));
      return;
    }

    const [s, e] = formatStartEnd(start, end);

    for (let i = 0; i < _data.length; i++) {
      if (s <= i && i <= e) {
        __setRectByIndex(i);
      } else {
        __resetRectByIndex(i);
      }
    }

    function __setRectByIndex(idx) {
      _root.selectAll(`.upid-label-${idx}`)
        .selectAll('rect')
        .call(g => updateElement(g, {
          stroke: 'blue'
        }))
    }
    function __resetRectByIndex(idx) {
      _root.selectAll(`.upid-label-${idx}`)
        .selectAll('rect')
        .call(g => updateElement(g, {
          stroke: 'red'
        }))
    }
  }

  #indexByUpid(upid) {
    const { _data } = this;
    return _data.map(d => d.upid).indexOf(upid);
  }
}