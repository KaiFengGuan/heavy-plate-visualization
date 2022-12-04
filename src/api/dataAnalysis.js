import request from '@/utils/request';

// 单块钢板指标数据
export function getPlateDataByUpid(upid) {
  return request({
    url: `/pidasApi/v1.0/getPlateDataByUpid?upid=${upid}`,
    method: 'get'
  })
}

