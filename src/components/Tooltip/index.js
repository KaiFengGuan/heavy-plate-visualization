import * as d3 from 'd3';

export const dir = {
  up: 'up',
  down: 'down'
};

function pathShape(direction, box, horizon, vertical, w, h /* w h 是那个尖儿的底和高 */) {
  let point = [
    [0, 0], [-w/2, -h], [-box.width/2 - horizon, -h],
    [-box.width/2 - horizon, -box.height - vertical*4],
    [box.width/2 + horizon, -box.height - vertical*4],
    [box.width/2 + horizon, -h], [w/2, -h], [0, 0]
  ]

  if (direction === dir.down) {
    point = point.map(d => [d[0], -d[1]]);
  }
  return `M${point.join("L")}Z`;
}

function isString(str) {
  return typeof str === 'string';
}

export default class TooltipClass {
  // w: svg初始宽度; h: svg初始高度; ele: svg挂载的父节点; tooltip: svg的id
  constructor ({ width, height }, ele, tooltipId) {
    this._viewWidth = width;
    this._viewHeight = height;

    this._container = d3.select(ele)
      .append('svg')
      .attr('class', 'root-svg')
      .attr('width', width)
      .attr('height', height)
      .attr('id', tooltipId)
      .attr('pointer-events', 'none') // 事件穿透
      .style('position', 'absolute')

    this._tooltipGroup = this._container.append('g')
      .attr('class', 'tooltip-group')
    this._backgroundPath = this._tooltipGroup.append('path')
      .attr('class', 'backgroud')
    this._contentGroup = this._tooltipGroup.append('g')
      .attr('class', 'content-group')
      .style('font-style', 'normal')
    
    this._tipViews = false;
    this._tipOptions = {};
    this._tooltipId = tooltipId;

    // 要保存的信息
    this._contentId = '';   // tooltip内容id值
    this._direction = dir.up; // tooltip在鼠标的上方还是下方
    this._contentBox = null;   // 内容尺寸记录
    this._x = 0;    // 位置
    this._y = 0;    // 位置
    this._content = null; // 渲染的内容
  }

  showTooltip(options){
    if (this._tipViews) {
      throw Error(`已存在id为${this._tooltipId}的提示框, 请先移除或者重新实例化一个!`);
    }

    this._tipViews = true;
    this._tipOptions = options;
    this.#watchTipView();
    return this;
  }

  removeTooltip(){
    this._tipViews = false;
    this.#watchTipView();
    return this;
  }

  #watchTipView() {
    const { paintChart, removeChart } = this.#useTooltip();
    this._tipViews ? paintChart() : removeChart();
  }

  #useTooltip() {
    let timer = null;
    const that = this;
    
    function paintChart() {
      if (timer)  clearTimeout(timer);

      that._container.attr('display', 'block');
      that._createToolTip(that._tipOptions);
    }
  
    function removeChart() {
      timer = setTimeout(()=> {
        that._container.attr('display', 'none');
      }, 0);
    }
  
    return {
      paintChart,
      removeChart,
    }
  }

  #hasContent() {
    return this._container.node().children.length > 0;
  }

  _createToolTip({
    id = Math.random().toString(),  // content id
    backgroundColor = 'white',
    stroke =  '#ccc',
    content = ['123', '43fsd', 'dsafdf'],  // content只能是字符串、字符串数组、柯里化后的函数
    vertical = 10,        // vertical padding
    horizon = 10,         // horizon padding
    boxWidth = 10,        // 尖角的宽度
    boxHeight = boxWidth * 1.732,
    x = 0,
    y = 0,
    direction = dir.up,
    color = 'black',
    fontSize = `12px`,
    fontFamily = 'inherit',
  } = {}) {
    if (!content) return;   // content没有指定，就不用渲染

    if (this._contentId === id && this._direction === direction) {
      this.#updateTooltipPosition(this._tooltipGroup, direction, {...this._contentBox, x, y});
      return;
    }

    this._backgroundPath
      .attr('stroke', stroke)
      .attr('stroke-width', 2)
      .attr('fill', backgroundColor);
    this._contentGroup
      .style('font-family', fontFamily)
      .style('font-size', fontSize)
      .attr('fill', color)

    // 渲染content
    const hasContent = this.#hasContent();
    if (hasContent && this._content !== content) {
      this._contentGroup.selectAll('*').remove();
    }
    this.#renderContent(content);
    
    // 更新位置和背景，对齐
    const contentBox = this.#getTooltipContentBox(this._contentGroup);
    this.#updateBackgroudPath(this._backgroundPath, direction, contentBox, {
      vertical, horizon, boxWidth, boxHeight
    });
    this.#updateTooltipContentPosition(this._contentGroup, direction, {
      height: contentBox.height, width: contentBox.width,
      vertical, horizon, boxWidth, boxHeight
    });
    const tooltipBox = this.#getTooltipBox(this._tooltipGroup);
    this.#updateTooltipPosition(this._tooltipGroup, direction, {
      height: tooltipBox.height, width: tooltipBox.width,
      x, y
    });
    this.#updateTooltipSize(tooltipBox);

    // 保存上一次绘制的信息
    this._contentId = id;
    this._content = content;
    this._x = x;
    this._y = y;
    this._contentBox = contentBox;
    this._direction = direction;
  }

  #renderContent(content) {
    // 渲染content的主要逻辑，根据不同类型进行
    if (isString(content)) {
      this._contentGroup.append('text')
        .text(content)
    } else if (Array.isArray(content) && content.every(isString)) {
      this._contentGroup.selectAll('text').data(content)
        .join('text')
        .attr('y', (_, i) => `${1.1*(i+1)}em`)
        .text(d => d)
    } else if (content instanceof Function) {
      content(this._contentGroup)
    }
  }

  #updateBackgroudPath(pathEle, direction=dir.up, box, {
    vertical=10,
    horizon=10,
    boxWidth=10,
    boxHeight=boxWidth*1.732
  }={}) {
    const pathStr = pathShape(direction, box, horizon, vertical, boxWidth, boxHeight);
    pathEle.attr('d', pathStr);
  }

  #getTooltipBox(tooltipGroup) {
    return tooltipGroup?.node()?.getBBox();
  }

  #getTooltipContentBox(contentGroup) {
    return contentGroup?.node()?.getBBox();
  }

  #updateTooltipPosition(group, direction=dir.up, {height=0, width=0, x=0, y=0}={}) {
    // const animation = group.transition().duration(500);
    if (direction === dir.up) {
      this._container
        .style('top', `${y - height}px`)
        .style('left', `${x - width/2}px`);
      group//.transition(animation)
        .attr('transform', `translate(${[width/2, height]})`)
    } else {
      this._container
        .style('top', `${y - 10}px`)
        .style('left', `${x - width/2}px`);
      group//.transition(animation)
        .attr('transform', `translate(${[width/2, 0]})`)
    }
  }

  #updateTooltipContentPosition(group, direction=dir.up, {
    height=0,
    width=0,
    vertical=10,
    horizon=10,
    boxWidth=10,
    boxHeight=boxWidth*1.732,
  }={}) {
    let x = 0, y = 0;
    if (direction === dir.up) {
      x = -width/2;
      y = -(height + vertical + boxHeight);
    } else {
      x = -width/2;
      y = vertical + boxHeight;
    }
    // const animation = group.transition().duration(500);
    group//.transition(animation)
      .attr('transform', `translate(${[x, y]})`);
  }

  #updateTooltipSize({height=0, width=0}={}) {
    this._container
      .style('height', height)
      .style('width', width)
  }
}
