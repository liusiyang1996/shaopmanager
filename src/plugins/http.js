import Axios from 'axios'
// Vue插件是包含一个公开方法install的对象
// 将axios变为vue的插件，使其能够应用vue.use()方法
const http = {}
http.install = function (Vue) {
  // 统一设置基准路径
  Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 统一设置请求拦截器
  Axios.interceptors.request.use(function (config) {
    if (config.url !== 'login') {
      // 为不是登录功能的请求添加指定请求头
      const AUTH_TOKEN = localStorage.getItem('token')
      config.headers.common['Authorization'] = AUTH_TOKEN
    }
    return config
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  })
  // 为Vue实例挂载axios
  Vue.prototype.$http = Axios
}

export default http
