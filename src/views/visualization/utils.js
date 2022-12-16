// 可视分析视图 配置
export const visualColor = {
  // 故障颜色
  good: '#94A7B7',
  bad: '#C65B24',
  noflag: '#71797E',

  // 工序颜色
  heating: '#FCD8A9',
  rolling: '#CCE9C7',
  cooling: '#C1C9EE',
};

export function getLabelColor(label) {
  if (label === '1') return visualColor.good;
  else if (label === '0') return visualColor.bad;
  else return visualColor.noflag;
}


export default {
  visualColor,
}