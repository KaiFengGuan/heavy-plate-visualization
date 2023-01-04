import store from '@/store';
import { keysName } from '../../utils';

const keysNameFlat = keysName.flat();
export function diagnosisDataToRenderData(data) {
  const start = new Date();
  const overviewData = store.getters.overviewData;
  const diagList = [];
  const upids = Object.keys(data);
  for (const upid of upids) {
    const item = overviewData.find(d => d.upid === upid);
    const diagItem = data[upid];
    if (!item || !diagItem) continue;
    // console.log(item)
    // console.log(diagItem)
    
    const diagData = {};  // 一块钢板的诊断数据, key是指标, value是诊断结果(上下限、T2、SPE)
    for (const key of keysNameFlat) {
      if(!diagData[key]) diagData[key] = {};

      diagData[key]['name'] = key;

      // 单维统计量
      let resultItem = diagItem.result.find(d => d.name === key);
      if (resultItem) {
        diagData[key]['value'] = resultItem['value'];
        diagData[key]['u'] = resultItem['u'];
        diagData[key]['l'] = resultItem['l'];
        diagData[key]['eu'] = resultItem['extremum_u'];
        diagData[key]['el'] = resultItem['extremum_l'];
        // diagData[key]['seu'] = resultItem['s_extremum_original_u'];
        // diagData[key]['sel'] = resultItem['s_extremum_original_l'];
        diagData[key]['o_value'] = resultItem['original_value'];
        diagData[key]['o_u'] = resultItem['original_u'];
        diagData[key]['o_l'] = resultItem['original_l'];
        diagData[key]['o_eu'] = resultItem['extremum_original_u'];
        diagData[key]['o_el'] = resultItem['extremum_original_l'];
        // diagData[key]['seu'] = resultItem['s_extremum_original_u'];
        // diagData[key]['sel'] = resultItem['s_extremum_original_l'];
      }

      // PCA - T2
      let T2Idx = diagItem.PCAT2.xData.indexOf(key);
      if (T2Idx !== -1) diagData[key]['T2'] = diagItem.PCAT2.sData[T2Idx];

      // PCA - SPE
      let QIdx = diagItem.PCASPE.xData.indexOf(key);
      if (QIdx !== -1) diagData[key]['Q'] = diagItem.PCASPE.sData[QIdx];
    }

    diagList.push({
      ...item,
      diagnosis: diagData
    })
  }

  const end = new Date();
  // console.log('diagList: ', diagList)
  // console.log(end.getTime() - start.getTime())

  return diagList;
}

// chart的绘图参数
export const cellAttr = {
  open_h: 25,
  open_w: 10,
  fold_h: 8,
  fold_w: 3,
  title_h: 50
};

/**
 * 数据切割
 *    1. 时间间隔过大
 *    2. 钢种不同
 */
export function dataSlicing(dataList) {
  const result = {
    typeData: {}, // 钢种数据
    timeLine: []  // 时间线排列的数据
  };
  const tooLargeInterval = (a, b) => {
    const tSpan = (b.getTime() - a.getTime()) / 1000 / 60;  // min
    return tSpan > 20;
  }
  let prev, temp = [];
  for (const item of dataList) {
    if (prev && (
      prev.steelspec !== item.steelspec ||
      tooLargeInterval(prev.toc, item.toc)
    )) {
      result.timeLine.push(temp);
      temp = [];
    }
    setTypeData(result.typeData, item.steelspec, item);
    temp.push(item);
    prev = item;
  }
  if (temp.length) result.timeLine.push(temp);
  
  return result;
}

function setTypeData(typeData, steelspec, data) {
  if (!typeData[steelspec]) typeData[steelspec] = {};
}
