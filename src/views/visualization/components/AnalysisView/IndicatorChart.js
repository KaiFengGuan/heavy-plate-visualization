import * as d3 from 'd3';
import { updateElement, translate } from '@/utils/selection';
import { keysName, processName } from '../../utils';
import { cellAttr } from './utils';
import { horizon, river } from './baseChart';

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
      let xOffset = 0;
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
    let xOffset = 0;
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
}