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

// 加热温度曲线
export function getHeatingCurveData(upid) {
  return request({
    url: `/pidasApi/v1.0/getHeatingCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 轧制报表
export function getRollingTableData(upid) {
  return request({
    url: `/pidasApi/v1.0/getRollingTableDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 轧制厚度曲线
export function getRollingThickCurve(upid) {
  return request({
    url: `/pidasApi/v1.0/getRollingThickCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 轧制测量值变化曲线
export function getRollingMeasCurve(upid) {
  return request({
    url: `/pidasApi/v1.0/getRollingMeasCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 轧制尺寸变化曲线
export function getRollingSizeCurve(upid) {
  return request({
    url: `/pidasApi/v1.0/getRollingSizeCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 冷却报表数据
export function getCoolingTableData(upid) {
  return request({
    url: `/pidasApi/v1.0/getCoolingTableDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 冷却扫描仪温度数据
export function getCoolingTempMapData(upid) {
  return request({
    url: `/pidasApi/v1.0/getCoolingTempMapDataByUpid?upid=${upid}`,
    method: 'get'
  });
}

// 冷却曲线数据
export function getCoolingCurveData(upid) {
  return request({
    url: `/pidasApi/v1.0/getCoolingCurveDataByUpid?upid=${upid}`,
    method: 'get'
  });
}
