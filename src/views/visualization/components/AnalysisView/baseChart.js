import * as d3 from 'd3';
import { randomString } from '@/utils';

/**
 *  g: horizon要挂载的group
 *  data: 横轴的数据
 */
export function horizon(g, data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  curve = d3.curveLinear, // method of interpolation between points
  width = 640, // outer width, in pixels
  height = 5, // outer height of a single horizon, in pixels
  bands = 3, // number of bands
  xType = d3.scaleBand, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [0, width], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height, height - bands * (height - 0)], // [bottom, top]
  scheme = d3.schemeBlues, // color scheme; shorthand for colors
  colors = scheme[Math.max(3, bands)], // an array of colors
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = X;
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);

  // A unique identifier for clip paths (to avoid conflicts).
  const uid = `O-${randomString()}`;

  // Construct an area generator.
  const area = d3.area()
    .curve(curve)
    .x(d => xScale(d.name))
    .y0(yScale(0))
    .y1(d => yScale(d.value));

  const defs = g.append("defs");
  defs.append("clipPath")
    .attr("id", `${uid}-clip`)
  .append("rect")
    .attr("width", width)
    .attr("height", height);

  defs.append("path")
    .attr("id", `${uid}-path`)
    .attr("d", area(data));

  g.attr("clip-path", `url(#${uid}-clip`)
  .selectAll("use")
  .data((d, i) => new Array(bands).fill(i))
  .join("use")
    .attr("fill", (_, i) => colors[i + Math.max(0, 3 - bands)])
    .attr("transform", (_, i) => `translate(0,${i * height})`)
    .attr("xlink:href", `#${uid}-path`);
}

export function river() {

}
