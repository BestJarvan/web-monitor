import request from '@/utils/request'

// 获取map文件
export function fetchMapFile(params = {}) {
  return request({
    requestBase: 'node',
    url: '/getMap/picp',
    method: 'get',
    params,
  })
}

