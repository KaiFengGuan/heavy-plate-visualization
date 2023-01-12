import * as d3 from 'd3';
import { appendElement, updateElement, translate } from '@/utils/selection';
import eventBus from '@/utils/eventBus';
import { keysName, processName, formatText, visualColor, schemeLabel } from '../../utils';
import { cellAttr, formatStartEnd } from './utils';
import { horizon, river } from './BaseChart';

import heating from '../../logo/heating.svg';
import rolling from '../../logo/rolling.svg';
import cooling from '../../logo/cooling.svg';
const processIcon = [heating, rolling, cooling];
const processColor = [visualColor.heating, visualColor.rolling, visualColor.cooling];

// l: 底, h: 高: a: 倾斜角度
const alpha = 65;
function xLenByAngle(h, alpha) {
  const r = alpha * Math.PI / 180;
  return h / Math.tan(r);
}
function parallelogramArea(l, h, a=alpha) {
  const x = xLenByAngle(h, a);
  const points = [[0, 0], [x, -h], [l+x, -h], [l, 0]];
  return `M${points.join("L")}Z`;
}

export default class IndicatorChart {
  constructor(group) {
    this._root = group; // 挂载的根节点

    this._data = null;
    this._diagMap = new Map();    // 每个钢板的每个工序的诊断结果
    this._groupMap = new Map();   // 每个钢板的每个工序的group
    this._foldState = [false, true, false];   // 各工序展开折叠状态

    this._flag = false;   // upid选择状态
    this._start = -1;
    this._end = -1;

    let yMax = 0.8, span = [[0, 0]];
    const n = Math.floor(schemeLabel.length/2);
    let s = yMax / n, t = 0;
    for (let i = 1; i <= n; i++) {
      if (i !== n) {
        span.unshift([-t-s, -t]);
        span.push([t, t+s]);
      } else {
        span.unshift([-Infinity, -t]);
        span.push([t, Infinity]);
      }
      t += s;
    }
    this._yMax = yMax;
    this._span = span;
    
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

    this.#renderLabel();
    this.#renderCell();
    this.#renderNames();

    return this;
  }

  getBatchHeight() {
    const { _start, _end, _data } = this;
    const { fold_h, open_h, title_h } = cellAttr;
    const [s, e] = formatStartEnd(_start, _end);

    let h = title_h;
    for (let i = 0; i < _data.length; i++) {
      h += (s <= i && i <= e) ? open_h : fold_h;
    }
    return h;
  }

  #renderCell() {
    const { _root, _foldState, _data, _diagMap, _groupMap } = this;
    const { fold_h } = cellAttr;

    for (let i = 0; i < _data.length; i++) {
      const { upid } = _data[i];
      const datum = _diagMap.get(upid).diagnosis;
      for (let j = 0; j < datum.length; j++) {
        const xOffset = this.#xOffsetByIndex(j),
              yOffset = this.#yOffsetByIndex(i);
        const g = _root.append('g')
          // .attr('transform', translate(xOffset, (_foldState[j] ? open_h : fold_h)*i))
          .attr('transform', translate(xOffset, yOffset))
          .attr('id', `${upid}_${j}`)
        
        _foldState[j]
          ? this.#renderOpenCell(g, datum[j], fold_h)
          : this.#renderFoldCell(g, datum[j], fold_h)

        _groupMap.get(upid)[j] = g;
      }
    }
  }

  // 根据显示模式控制视图的取值方式
  #chartYValue() {
    const yValue = d => {
      let { value, u, l } = d;
      if (l<=value && value<=u) return 0;
      else if (value < l) return value - l;
      else return value - u;
    };

    return yValue;
  }

  // 根据给定值返回 schemeLabel 颜色的索引
  #colorIndex(value) {
    const { _span } = this;
    const n = _span.length;

    for (let i = 0; i < n; i++) {
      const [x1, x2] = _span[i];
      if (x1 === 0 && x2 === 0 && value === 0) return i;
      if (x1 <= value && value < x2) return i;
    }

    return Math.floor(n / 2);
  }

  #renderFoldCell(group, data, height) {
    const color = (d) => {
      if (d.value >= d.u) return ['red', d.value - d.u]
      else if (d.value <= d.l) return ['blue', d.l - d.value]
      else return ['white', 1]
    }
    const { fold_w } = cellAttr;
    // const yValue = this.#chartYValue();
    // group.selectAll('.indicator')
    //   .data(data)
    //   .join('rect')
    //   .attr('width', fold_w)
    //   .attr('height', height)
    //   .attr('x', (d, i) => fold_w*i)
    //   // .attr('fill', d => {
    //   //   const y = yValue(d);
    //   //   const idx = this.#colorIndex(y);
    //   //   console.log(y, idx)
    //   //   return schemeLabel[idx]
    //   // })
    //   .attr('fill', d => color(d)[0])
    //   .attr('opacity', d => color(d)[1])


    const { _yMax } = this;
    horizon(group, data, {
      x: d => d.name,
      y: this.#chartYValue(),
      height: height,
      width: data.length * fold_w,
      yDomain: [-_yMax, _yMax],
      colors: schemeLabel
    })
  }

  #renderOpenCell(group, data, height) {
    const { open_w } = cellAttr;
    const { _yMax } = this;

    horizon(group, data, {
      x: d => d.name,
      y: this.#chartYValue(),
      height: height,
      width: data.length * open_w,
      yDomain: [-_yMax, _yMax],
      colors: schemeLabel
    })
  }

  #renderNames() {
    const that = this;
    const { _root, _foldState } = this;

    const g = _root.append('g');
    for (let i = 0; i < 3; i++) {
      const xOffset = this.#xOffsetByIndex(i);
      const nameG = g.append('g')
        .attr('transform', translate(xOffset, 0))
        .attr('class', `name-group-${i}`);

      this.#renderNameBgc(nameG, i);

      _foldState[i]
        ? this.#renderOpenName(nameG, i)
        : this.#renderFoldName(nameG, i)

      this.#renderIcon(nameG, processIcon[i], i);
      this.#updateIconPosition(i);
    }

    g.selectAll('.icon-group')
      .on('click', function() {
        const idx = parseInt(d3.select(this).attr('data-index'));
        that._foldState[idx] = !that._foldState[idx];
        that.#setProcessState();
        that.#setNameState();
      })
  }

  #renderFoldName(group, idx) {
    const width = keysName[idx].length * cellAttr.fold_w;
    const data = processName[idx];
    const xErr = xLenByAngle(cellAttr.title_h/2, alpha);
    group
      .call(g => appendElement(g, 'text', {
        text: data,
        x: width/2 + xErr,
        y: -cellAttr.title_h/2 + 4,
        class: 'process-name',
        'font-size': 12,
        'text-anchor': 'middle',
        'dominant-baseline': 'hanging'
      }))
      .style('user-select', 'none')
  }

  #renderOpenName(group, idx) {
    const data = keysName[idx];
    group.selectAll('text')
      .data(data)
      .join('text')
      .call(g => updateElement(g, {
        text: d => formatText(d),
        transform: (d, i) => `translate(${i*10+2}, -5) rotate(-55)`,
        class: 'process-name',
        'font-size': 8,
        'dominant-baseline': 'hanging'
      }))
      .style('user-select', 'none')
  }

  #renderIcon(group, iconUrl, idx) {
    const iconW = 12, rectW = 16;
    const groupAttr = {
      class: 'icon-group',
      'data-index': idx,
      cursor: 'pointer'
    }
    const imgAttr ={
      width: iconW, height: iconW,
      x: -iconW/2, y: -iconW/2,
      href: iconUrl
    };

    const rectAttr = {
      width: rectW, height: rectW, rx: rectW/2,
      x: -rectW/2, y: -rectW/2,
      stroke: 'transparent',
      'stroke-width': 5,
      fill: 'white'
    };
    group.append('g')
      .call(g => updateElement(g, groupAttr))
      .call(g => appendElement(g, 'rect', rectAttr))
      .call(g => appendElement(g, 'image', imgAttr))
  }

  #updateIconPosition(idx) {
    const { _root, _foldState } = this;
    const { fold_w, open_w, title_h } = cellAttr;
    const open = _foldState[idx];
    const width = keysName[idx].length * (open ? open_w : fold_w);
    const nameG = _root.selectAll(`.name-group-${idx}`);

    let x, y;
    if (open) {
      x = 10 + xLenByAngle(title_h, alpha);
      y = -title_h + 12;
    } else {
      x = width/2 + xLenByAngle(title_h/2, alpha);
      y = -title_h/2 - 8
    }
    nameG.selectAll('.icon-group')
      .call(g => updateElement(g, {
        transform: translate(x, y)
      }))
      .call(g => g.raise())
  }

  #renderNameBgc(group, idx) {
    const { _foldState } = this;
    const { fold_w, open_w, title_h } = cellAttr;
    const open = _foldState[idx];
    const len = keysName[idx].length;
    const pathAttr = {
      class: 'name-bgc',
      stroke: processColor[idx],
      // fill: d3.color(processColor[idx]).brighter(0.5),
      fill: 'white',
      d: parallelogramArea(len * (open ? open_w : fold_w), title_h)
    };
    group.call(g => appendElement(g, 'path', pathAttr))
  }

  #labelWidth() {
    const { open_h } = cellAttr;
    return open_h * 5;
  }

  #renderLabel() {
    const that = this;
    const { _root, _data } = this;
    const { open_h, fold_h } = cellAttr;

    const gAttr = {
      transform: (_, i) => translate(0, this.#yOffsetByIndex(i)),
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
      if (!that._flag) that._start = idx;
      else that._end = idx;
      
      if (that._start === -1 && that._end === -1) {
        __displayClearButton(false);
      } else {
        __displayClearButton(true);
        if (that._start !== -1 && that._end !== -1) {
          const [s, e] = formatStartEnd(that._start, that._end);
          that.#setPlateState(s, e, true);
          eventBus.emit('changePlatesSelected');
        }
      }

      that._flag = !that._flag;
    }
    function __overHandle(e, d) {
      if (!that._flag) return;

      const tempEnd = that.#indexByUpid(d.upid);
      that.#setLabelGroupStyle(that._start, tempEnd);
    }
    function __resetHandle() {
      let oldS = that._start, oldE = that._end;
      that._flag = false;
      that._start = -1;
      that._end = -1;
      that.#setPlateState(oldS, oldE, false);
      that.#setLabelGroupStyle(that._start, that._end);
      __displayClearButton(false);
      eventBus.emit('changePlatesSelected');
    }
    function __displayClearButton(display) {
      _root.select('.clear-button').attr('display', display ? 'block' : 'none');
    }
  }

  #setLabelGroupStyle(start, end) {
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

  // 按行设置折叠/展开状态.  open控制 [start, end] 范围内的变化方式
  #setPlateState(start, end, open) {
    const { _root, _data, _groupMap } = this;
    const { open_h, fold_h } = cellAttr;
    const [s, e] = formatStartEnd(start, end);
    const h = open ? open_h : fold_h;

    for (let i = 0; i < _data.length; i++) {
      const upid = _data[i].upid;
      const _o = (s <= i && i <= e) && open;
      const yOffset = this.#yOffsetByIndex(i);

      this.#setLabelStateByIndex(i, yOffset, _o);   // 设置标签区域
      this.#setCellStateByUpid(upid, yOffset, _o);  // 设置指标区域
    }
  }

  #setLabelStateByIndex(idx, yOffset, open) {
    const { _root } = this;
    const { open_h, fold_h } = cellAttr;

    const g = _root.selectAll(`.upid-label-${idx}`);
    g.attr('transform', translate(0, yOffset));
    g.selectAll('rect').attr('height', open ? open_h : fold_h);
  }

  #setCellStateByUpid(upid, yOffset, open) {
    const { _diagMap, _groupMap, _foldState } = this;
    const { open_h, fold_h } = cellAttr;

    const gArr = _groupMap.get(upid);
    if (!gArr) return;

    for (let i = 0; i < _foldState.length; i++) {
      if (_foldState[i]) {
        const datum = _diagMap.get(upid).diagnosis;
        __setOpenCell.call(this, gArr[i], datum[i], yOffset, open);
      } else {
        __setFoldCell(gArr[i], yOffset, open);
      }
    }

    function __setFoldCell(g, yOffset, open) {
      const transform = g.attr('transform');
      g.attr('transform', transform.split(',')[0] + `,${yOffset})`);
      g.selectAll('rect').attr('height', open ? open_h : fold_h);
    }
    function __setOpenCell(g, data, yOffset, open) {
      const transform = g.attr('transform');
      g.attr('transform', transform.split(',')[0] + `,${yOffset})`);

      g.selectChildren().remove();
      this.#renderOpenCell(g, data, open ? open_h : fold_h)
    }
  }

  // 按 列 设置折叠/展开状态.
  #setProcessState() {
    const that = this;
    const { _data, _groupMap, _diagMap, _foldState, _start, _end } = this;
    const { open_w, open_h, fold_w, fold_h } = cellAttr;

    for (let i = 0; i < _data.length; i++) {
      const { upid } = _data[i];
      const datum = _diagMap.get(upid).diagnosis;
      const gArr = _groupMap.get(upid);
      if (!gArr) continue;

      const [s, e] = formatStartEnd(_start, _end);
      let h = fold_h;
      if ((s!==-1 && e!==-1) && (s<=i && i<=e)) h = open_h;

      for (let j = 0; j < _foldState.length; j++) {
        const g = gArr[j];
        const xOffset = this.#xOffsetByIndex(j),
              yOffset = this.#yOffsetByIndex(i);
        const transform = g.attr('transform');
        g.attr('transform', translate(xOffset, yOffset));
        
        g.selectChildren().remove();
        _foldState[j]
          ? this.#renderOpenCell(g, datum[j], h)
          : this.#renderFoldCell(g, datum[j], h)
      }
    }
  }

  #setNameState() {
    for (let i = 0; i < 3; i++) {
      const nameG = this._root.selectAll(`.name-group-${i}`);
      const xOffset = this.#xOffsetByIndex(i);

      nameG.attr('transform', translate(xOffset, 0));
      __setBackground.call(this, nameG, i);
      __setProcessName.call(this, nameG, i);
      this.#updateIconPosition(i);
    }

    function __setBackground(g, i) {
      const { _foldState } = this;
      const { fold_w, open_w, title_h } = cellAttr;
      const open = _foldState[i];
      const length = keysName[i].length,
            height = title_h;
      g.selectAll('.name-bgc')
        .call(g => updateElement(g, {
          // stroke: processColor[i],
          // fill: open ? 'white' : d3.color(processColor[i]).brighter(0.5),
          d: parallelogramArea(length*(open?open_w:fold_w), height)
        }))
    }
    function __setProcessName(g, i) {
      const { _foldState } = this;
      g.selectAll('.process-name').remove();
      _foldState[i]
        ? this.#renderOpenName(g, i)
        : this.#renderFoldName(g, i)
    }
  }

  #xOffsetByIndex(idx) {
    const { _foldState } = this;
    const { fold_w, open_w } = cellAttr;
    let offset = this.#labelWidth();
    const padding = 3;
    for (let i = 0; i < _foldState.length; i++) {
      if (i === idx) break;
      const open = _foldState[i],
            length = keysName[i].length;
      offset += length * (open ? open_w : fold_w) + padding;
    }
    return offset;
  }

  #yOffsetByIndex(idx) {
    const { _data, _start, _end } = this;
    const { fold_h, open_h } = cellAttr;
    const [s, e] = formatStartEnd(_start, _end);
    let offset = 0;
    for (let i = 0; i < _data.length; i++) {
      if (i === idx) break;
      offset += (s <= i && i <= e) ? open_h : fold_h;
    }
    return offset;
  }
}