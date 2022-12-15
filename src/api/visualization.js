import request from '@/utils/request';

// 一个月的产量统计
export function getNumberOfPlatesByTime(date) {
  return request({
    url: `/newbaogangapi/v1.0/getNumberOfPlatesByTime?date=${date}`,
    method: 'get'
  })
}

// // 加热关键指标对比分析
// export function getHeatingAnalysisDataByUpid(upid, data) {
//   return request({
//     url: `/pidasApi/v1.0/getHeatingAnalysisDataByUpid?upid=${upid}`,
//     method: 'post',
//     data
//   })
// }
