import request from '@/utils/request'

// 错误信息列表
export function fetchErrorList(data = {}) {
  return request({
    requestBase: 'java',
    url: '/log-center/log/query',
    method: 'post',
    data,
  })
}

