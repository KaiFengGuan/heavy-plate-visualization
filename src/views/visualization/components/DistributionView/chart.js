import * as d3 from 'd3';
import { dir } from '@/components/Tooltip';
import { randomString, curry } from '@/utils';
import { getLabelColor } from '../../utils';
import tooltipIns from '@/utils/tooltip';
import store from '@/store';

const nameMap = {
  tgtwidth: { abbr: 'width', zh: '轧制宽度设定值' },
  tgtplatelength2: { abbr: 'length', zh: '轧制长度设定值' },
  tgtthickness: { abbr: 'thick', zh: '轧制厚度设定值' },
  tgtdischargetemp: { abbr: 'disTemp', zh: '出钢温度设定值'},
  tgttmplatetemp: { abbr: 'tmp', zh: '完成滚动温度设定值' }
};

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

    this._x = null;
    this._y = null;

    this._name = '',  // 名称
    this._distribution = null;  // 分布数据
    this._label = null;
    this._firstLabel = null;
    this._maxBins = 0;    // y轴高度统一

    this._active = false; // 当前规格是否被选中
    this._brushState = false;

    this._pieGen = d3.pie()
      .value(d => d.value)
      .sort((a, b) => a.label.localeCompare(b.label));

    return this;
  }

  dataInit(data, maxBins) {
    this._name = data.name;
    this._distribution = data.values;
    this._label = data.label;
    this._firstLabel = data.label;
    this._maxBins = maxBins;

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#scaleInit();

    this.#renderBackground();
    this.#renderDistribution();
    this.#renderBrush();
    this.#renderInfo();
    this.#renderLabelPercent();

    const that = this;
    this._root.on('click', function() {
      if (!that._brushState) return;

      if (!that._active) {
        that.#activate();
      } else {
        that.#deactivate();
      }
    })

    return this;
  }

  #scaleInit() {
    const { _distribution } = this;
    let minX = Number.MAX_SAFE_INTEGER, 
      maxX = Number.MIN_SAFE_INTEGER;
    minX = Math.min(minX, ..._distribution.map(d => d.x0));
    maxX = Math.max(maxX, ..._distribution.map(d => d.x1));
    const theta = 0.15;  // 多留一些范围做规格筛选用
    minX *= 1 - theta;
    maxX *= 1 + theta;

    const { _width, _height, _maxBins } = this;
    const { left, right, top, bottom } = this._margin;
    const xDomain = [minX < 0 ? 0 : minX, maxX],
      yDomain = [0, _maxBins];
    const xRange = [left+170, _width-right-5],
      yRange = [_height-bottom-10, top+5];
    
    this._x = d3.scaleLinear(xDomain, xRange);
    this._y = d3.scaleLinear(yDomain, yRange);
  }

  #renderBackground() {
    const { _root, _width, _height, _margin } = this;
    const { left, right, top, bottom } = _margin;
    const offset = 5;
    const borderColor = '#86909C';

    const bgcGroup = _root.append('g')
      .attr('class', 'background-group')
    const bgcStyle = g => g
      .attr('y', top-offset)
      .attr('height', _height-top-bottom+offset*2)
      .attr('rx', '5px')
      .attr('fill', '#fff')
      .attr('stroke', borderColor)
      .attr('stroke-dasharray', '6 6')
    
    const infoW = 140,
      infoRectX = left-offset;
    bgcGroup.append('rect')
      .attr('class', 'info-bgc')
      .attr('x', infoRectX)
      .attr('width', infoW)
      .call(bgcStyle)
    
    const binBgcW = 205,
      binBgcRectX = _width-right-binBgcW+5;
    bgcGroup.append('rect')
      .attr('class', 'bin-bgc')
      .attr('x', binBgcRectX)
      .attr('width', binBgcW)
      .call(bgcStyle)
    
    bgcGroup.selectAll('.link-point')
      .data([infoRectX+infoW, binBgcRectX])
      .join('g')
      .attr('transform', d => `translate(${[d, _height/2]})`)
      .call(g => g
        .append('circle')
        .attr('class', 'link-point')
        .attr('r', 1.5)
        .attr('fill', borderColor)
        .attr('stroke', '#fff')
        .attr('stroke-width', 5)
      )
    bgcGroup.append('line')
      .attr('class', 'link-line')
      .attr('transform', `translate(0, ${_height/2})`)
      .attr('x1', infoRectX+infoW)
      .attr('x2', binBgcRectX)
      .attr('stroke', borderColor)
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 3')
  }

  #renderDistribution() {
    const { _x, _y, _root, _height, _margin } = this;
    _root.append('g')
      .attr('class', 'distribution-bar')
    .selectAll('.bin-bar')
    .data(this._distribution)
    .join('rect')
      .attr('class', 'bin-bar')
      .attr('x', d => _x(d.x0))
      .attr('y', d => _y(d.length)-1)
      .attr('width', d => Math.max(0, _x(d.x1) - _x(d.x0)))
      .attr('height', d => _y(0) - _y(d.length)+1)
      .attr('fill', '#A8A8A8')
      .attr('stroke', '#959595')
    
    _root.append('g')
      .attr('transform', `translate(0, ${_height-_margin.bottom-10})`)
      .call(d3.axisBottom(_x.nice()).ticks(5).tickSize(3))
      .call(g => {
        g.attr('font-size', 7.5)
          .attr('color', '#2c2c2c')
        g.selectAll('.tick line').attr('y2', 3)
      })
  }

  #renderBrush() {
    const that = this;
    const { _x, _y, _root, _name, _margin } = this;
    const xRange = _x.range(),
      yRange = _y.range();
    const binsBar = _root.selectAll('.bin-bar');
    
    const brush = d3.brushX()
      .extent([[xRange[0], yRange[1]-5], [xRange[1], yRange[0]]])
      .on('start brush', _brushingHandle)
      .on('end', _brushEndHandle);
    
    _root.append('g')
      .attr('class', 'brush-group')
      .call(brush)
    
    function _brushingHandle({selection}) {
      if (selection === null) {
        binsBar.attr('opacity', 1);
      } else {
        const computedOpacity = d => {
          let newX = _x(d.x0);
          // let barW = Math.max(0, _x(d.x1) - _x(d.x0));
          return newX >= selection[0] && newX < selection[1];
        }
        binsBar.attr('opacity', d => computedOpacity(d) ? 1 : 0.5);

        const range = selection.map(d => {
          let v = _x.invert(d);
          if (v >= 100 && v < 1000) return v.toFixed(1);
          else if (v > 1000) return v.toFixed(0);
          else return v.toFixed(2);
        });
        that.#setBrushRange(...range);

        const newLabelData = that.#getBrushLabelData(...range);
        that.#updateLabelPercent(newLabelData);
      }
    }
    function _brushEndHandle({selection}) {
      if (selection === null) {
        that._brushState = false;
        binsBar.attr('opacity', 1);
        that.#hiddenBrushRange();
        that.#updateLabelPercent(that._firstLabel);
        that.#deactivate();
        return;
      };
      that._brushState = true;
      const plateParams = store.getters.plateParams;
      store.dispatch('visual/setPlateParams', {
        ...plateParams,
        [_name]: selection.map(d => _x.invert(d))
      });
    }
  }

  #getBrushLabelData(r1, r2) {
    const overviewData = store.getters.overviewData;
    const key = this._name;
    const filter = overviewData.filter(item => {
      return item[key]>=r1 && item[key]<=r2;
    });
    return [
      { label: '1', value: filter.filter(d => d.label==='1').length },
      { label: '0', value: filter.filter(d => d.label==='0').length },
      { label: '404', value: filter.filter(d => d.label==='404').length }
    ]
  }

  #renderLabelPercent() {
    const { _root, _height, _label, _pieGen } = this;
    const { left } = this._margin;

    const pieMap = new Map();
    const pieData = _pieGen(_label);
    pieData.forEach(d => pieMap.set(d.data.label, d));
    
    _root.append('g')
      .attr('transform', `translate(${[left+105, _height/2]})`)
      .selectAll('.arc')
      .data(['0', '1', '404'])
      .join('path')
      .attr('class', 'label-arc')
      .attr('fill', d => getLabelColor(d))
      .attr('d', d => {
        const item = pieMap.get(d);
        return d3.arc()
          .innerRadius(0)
          .outerRadius(_height/2*0.55)
          .startAngle(item.startAngle)
          .endAngle(item.endAngle)();
      })
  }

  #updateLabelPercent(newLabelData) {
    const { _root, _label, _height, _pieGen } = this;

    const oldPieMap = new Map();
    const oldPieData = _pieGen(_label);
    oldPieData.forEach(d => oldPieMap.set(d.data.label, d));

    const newPieMap = new Map();
    const newPieData = _pieGen(newLabelData);
    newPieData.forEach(d => newPieMap.set(d.data.label, d));

    _root.selectAll('.label-arc')
      .transition(d3.transition().duration(50))
      .attrTween('d', d => {
        const oldItem = oldPieMap.get(d),
          newItem = newPieMap.get(d);
        const startInter = d3.interpolate(oldItem.startAngle, newItem.startAngle),
          endInter = d3.interpolate(oldItem.endAngle, newItem.endAngle);
        return function(t) {
          return d3.arc()
            .innerRadius(0)
            .outerRadius(_height/2*0.55)
            .startAngle(startInter(t))
            .endAngle(endInter(t))();
        }
      })

    this._label = newLabelData;
  }

  #renderInfo() {
    const { _root, _name } = this;
    const { top, left, bottom } = this._margin;
    const nameSize = 12;
    const rectPadding = { lr: 6, tb: 2.5 };
    const range = store.getters.plateParams[_name]

    const nameG = _root.append('g')
      .attr('class', 'name-group')
      .attr('transform', `translate(5, 5)`)
      .attr('fill', '#4E5969')
      .attr('font-size', nameSize)
      .attr('font-weight', 550)

    const nameX = left+rectPadding.lr,
      nameY = top+nameSize+rectPadding.tb-1.5;
    nameG.append('text')
      .text(nameMap[_name].abbr)
      .attr('class', 'title-name')
      .attr('x', nameX)
      .attr('y', nameY)
  
    const text = nameG.select('text')
    const { width, height } = text.node().getBBox();
    nameG.append('rect')
      .attr('class', 'title-background')
      .attr('x', left)
      .attr('y', top)
      .attr('rx', 8)
      .attr('width', width+rectPadding.lr*2)
      .attr('height', height+rectPadding.tb*2)
      .attr('fill', '#fff')
      .attr('stroke', '#86909C')
    
    nameG.select('text').raise();

    nameG.append('text')
      .text(`[ ${range[0]}, ${range[1]} ]`)
      .attr('class', 'brush-range-text')
      .attr('display', 'none')
      .attr('x', nameX)
      .attr('y', nameY + 21)
      .attr('font-size', nameSize-2)
      .attr('font-weight', 550)
      
    nameG.selectAll('.title-name')
      .on('mouseenter', function(e) {
        tooltipIns && tooltipIns.showTooltip({
          id: randomString(), x: e.pageX, y: e.pageY,
          content: [nameMap[_name].zh],
        });
      })
      .on('mouseleave', function() {
        tooltipIns && tooltipIns.removeTooltip();
      })
  }

  #setBrushRange(r1, r2) {
    this._root.select('.brush-range-text')
      .text(`[ ${r1}, ${r2} ]`)
      .attr('display', '')
  }

  #hiddenBrushRange() {
    this._root.select('.brush-range-text')
      .attr('display', 'none')
  }

  #activate() {
    this._active = true;

    const { _root } = this;
    const trans = d3.transition().duration(500);
    
    const bgG = _root.select('.background-group');
    bgG.selectAll('rect').transition(trans)
      .attr('stroke-dasharray', '6 0')
      .attr('stroke-width', 1.5)
    bgG.selectAll('line').transition(trans)
      .attr('stroke-dasharray', '4 0')
    bgG.selectAll('.link-point').transition(trans)
      .attr('r', 4.5)
    // bgG.selectAll('.link-line').transition(trans)
    //   .attr('stroke-width', 1.5)

    const nameG = _root.selectAll('.name-group');
    nameG.selectAll('.title-background').transition(trans)
      .attr('fill', '#86909C')
    nameG.selectAll('.title-name').transition(trans)
      .attr('fill', '#FFF')
  }

  #deactivate() {
    this._active = false;

    const { _root } = this;
    const trans = d3.transition().duration(500);
    
    const bgG = _root.select('.background-group');
    bgG.selectAll('rect').transition(trans)
      .attr('stroke-dasharray', '6 6')
      .attr('stroke-width', 1)
    bgG.selectAll('line').transition(trans)
      .attr('stroke-dasharray', '4 3')
    bgG.selectAll('.link-point').transition(trans)
      .attr('r', 1.5)
    // bgG.selectAll('.link-line').transition(trans)
    //   .attr('stroke-width', 1.5)

    const nameG = _root.selectAll('.name-group');
    nameG.selectAll('.title-background').transition(trans)
      .attr('fill', '#FFF')
    nameG.selectAll('.title-name').transition(trans)
      .attr('fill', '#4E5969')
  }
}
