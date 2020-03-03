// 基于axios实现接口请求库的封装
import axios from 'axios'
import qs from 'qs' // 引入qs模块，用来序列化post类型的数据
// 根据环境变量区分接口的默认地址
switch (process.env.NODE_ENV) {
  case 'production':
    axios.defaults.baseURL = 'http://api.zhufengpeixun.cn'
    break
  case 'test':
    axios.defaults.baseURL = 'http://192.168.20.12:8080'
    break
  default:
    axios.defaults.baseURL = 'http://127.0.0.1:3000'
}
// 设置超时请求时间
axios.defaults.timeout = 10000
// 设置CORS跨域允许携带资源凭证
axios.defaults.withCredentials = true
// 设置POST请求头：告知服务器请求主体的数据格式
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.transformRequest = data => qs.stringify(data)
// 设置请求拦截器
axios.interceptors.request.use(
  config => {
    // TOKEN校验（JWT）,接收服务器返回的token，存储到 vuex本地存储中，每一次向服务器发请求，我们应该把token带上
    const token = localStorage.getItem('token')
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)
// 设置响应拦截器
axios.defaults.validateStatus = status => {
  // 自定义响应成功的HTTP状态码
  return /^(2|3)\d{2}$/.test(status)
}
axios.interceptors.response.use(
  response => {
    // 只返回响应主体中的信息（部分公司根据需求会进一步完善，例如指定服务器返回的CODE值来指定成功还是失败）
    return response.data
  },
  error => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)'
          break
        case 401: // 当前请求需要用户验证（一般是未登录）
          error.message = '未授权，请登录(401)'
          break
        case 403: // 服务器已经理解请求，但是拒绝执行它（一般是TOKEN过期）
          error.message = '拒绝访问(403)'
          localStorage.removeItem('token')
          // 跳转到登录页
          break
      }
      return Promise.reject(error.response)
    } else {
      // 断网处理
      if (!window.navigator.onLine) {
        // 断开网络了，可以让其跳转到断网页面
        return
      }
      return Promise.reject(error)
    }
  }
)
export default axios
