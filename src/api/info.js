import request from '@/utils/request'

// 错误信息列表
export function fetchErrorList(params) {
  return request({
    url: '/getErrorList',
    method: 'get',
    params,
  })
}

