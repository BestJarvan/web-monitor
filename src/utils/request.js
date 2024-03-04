import axios from 'axios'

const service = axios.create({})

service.interceptors.request.use(
  (config) => {
    config.baseURL = import.meta.env.VITE_BASE_URL_API

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
      console.log('data: ', data);
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
