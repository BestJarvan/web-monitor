import request from '@/utils/request'

// 错误信息列表
export function fetchErrorList(data) {
  return request({
    url: '/getErrorList',
    method: 'post',
    data,
  })
}

