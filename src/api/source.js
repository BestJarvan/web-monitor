import request from '@/utils/request'

// cos文件列表
export function fetchMapFileList(params) {
  return request({
    url: '/getCosMap',
    method: 'get',
    params,
  })
}

// 删除cos文件
export function delMapFile(params) {
  return request({
    url: '/delCosMap',
    method: 'delete',
    params,
  })
}

