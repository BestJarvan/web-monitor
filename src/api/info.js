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

// 错误信息详情页
export function fetchErrorDetail(params = {}) {
  return request({
    requestBase: 'java',
    url: '/log-center/log/queryDetails',
    method: 'get',
    params,
  })
}

// 录屏信息
export function fetchRecordScreen(params = {}) {
  return request({
    requestBase: 'java',
    url: '/log-center/log/queryDetailsByRecordScreenId',
    method: 'get',
    params,
  })
}

