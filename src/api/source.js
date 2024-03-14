import request from '@/utils/request'

// cos文件列表
export function fetchMapFileList(params = {}) {
  return request({
    requestBase: 'node',
    url: '/getCosMap',
    method: 'get',
    params,
  })
}

// 删除cos文件
export function delMapFile(params = {}) {
  return request({
    requestBase: 'node',
    url: '/delCosMap',
    method: 'delete',
    params,
  })
}

