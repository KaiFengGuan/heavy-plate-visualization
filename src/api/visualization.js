import request from '@/utils/request';

// 一个月的产量统计
export function getNumberOfPlatesByTime(date) {
  return request({
    url: `/newbaogangapi/v1.0/getNumberOfPlatesByTime?date=${date}`,
    method: 'get'
  })
}

// 降维数据
export function getScatterDataByTime(params) {
  return request({
    url: `/newbaogangapi/v1.0/getScatterDataByTime`,
    method: 'get',
    params
  })
}

// 诊断数据
export function getDiagnosesDataByUpids(data) {
  return request({
    url: '/newbaogangapi/v1.0/getDiagnosesDataByUpids',
    method: 'post',
    data
  })
}
