import axios from 'axios'

const service = axios.create({})

service.interceptors.request.use(
  (config) => {
    const API_MAP = {
      'NODE': import.meta.env.VITE_BASE_URL_API,
      'JAVA': import.meta.env.VITE_BASE_JAVA_URL_API,
    }
    const BASE_TYPE = config.requestBase ? config.requestBase.toUpperCase() : ''
    config.baseURL = API_MAP[BASE_TYPE] !== undefined ? API_MAP[BASE_TYPE] : import.meta.env.VITE_BASE_URL_API

    config.timeout = config.timeout ? config.timeout : 10000 // 自定义超时时间
    return config
  },
  (error) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  ({ config, data, headers }) => {
    const { code, msg } = data
    if (code === '00000') {
      return data
    } else {
      ElMessage({
        message: msg || '系统出错',
        type: 'error',
      })
      return Promise.reject(new Error(msg || 'Error'))
    }
  },
  (error) => {
    console.log(`err${error}`) // for debug
    ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    })
    return Promise.reject(error)
  }
)

export default service
