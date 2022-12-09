import request from '@/utils/request';

// 单块钢板指标数据
export function getPlateDataByUpid(upid) {
  return request({
    url: `/pidasApi/v1.0/getPlateDataByUpid?upid=${upid}`,
    method: 'get'
  })
}

// 加热关键指标对比分析
export function getHeatingAnalysisDataByUpid(upid, data) {
  return request({
    url: `/pidasApi/v1.0/getHeatingAnalysisDataByUpid?upid=${upid}`,
    method: 'post',
    data
  })
}
