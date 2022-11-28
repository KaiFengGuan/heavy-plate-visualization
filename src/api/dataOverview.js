import request from '@/utils/request';

// 关键指标报表
export function getKeyIndicatorsList(data) {
  return request({
    url: '/pidasApi/v1.0/getKeyIndicatorsList',
    method: 'post',
    data
  })
}

// 生产节奏可视化
export function getRhythmData(data) {
  return request({
    url: '/pidasApi/v1.0/getRhythmDataByTime',
    method: 'post',
    data
  })
}

// 加热数据报表
export function getHeatingTableData(upid) {
  return request({
    url: `/pidasApi/v1.0/getHeatingTableDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

export function getHeatingCurveData(upid) {
  return request({
    url: `/pidasApi/v1.0/getHeatingCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}
