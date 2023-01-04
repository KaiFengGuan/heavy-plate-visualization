import * as d3 from 'd3';
import { updateElement, translate } from '@/utils/selection';
import { dataSlicing, cellAttr } from './utils';
import IndicatorChart from './IndicatorChart';

export default class AnalysisChart {
  constructor({
    width,
    height,
    margin={top: 10, bottom: 10, left: 10, right: 10}
  } = {}, rootNode) {
    this._width = width;
    this._height = height;
    this._margin = margin;
    this._root = rootNode;
    this._layout = {
      x1: 10,   // 类型视图与左边距离
      x2: 100   // 指标视图与左边距离
    }

    this._x = null;
    this._y = null;
    this._brush = null;

    this._data = null;
    this._typeData = null;
    this._timeData = null;

    return this;
  }

  dataInit(data) {
    this._data = data.map(d => {
      d.toc = new Date(d.toc);
      return d;
    });

    const { typeData, timeLine } = dataSlicing(this._data);
    this._typeData = typeData;
    this._timeData = timeLine;

    // console.log(this._typeData);
    // console.log(this._timeData);

    return this;
  }

  render() {
    this._root.selectChildren().remove();  // 先清空

    this.#renderBatch();

    return this;
  }

  #renderBatch() {
    const { _root, _layout, _timeData } = this;

    const batchHeight = d => d.length*cellAttr.fold_h + cellAttr.title_h;
    _root.selectAll('.batch')
      .data(_timeData)
      .join('g')
      .attr('transform', (d, i) => {
        const prevH = _timeData.slice(0, i).map(e => batchHeight(e));
        const yOffset = prevH.reduce((a, b) => a+b, 0);
        return translate(_layout.x2, yOffset);
      })
      .attr('custom--handle', function (d) {
        const ins = new IndicatorChart(d3.select(this));
        ins.dataInit(d).render();
      })

  }
}