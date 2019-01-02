import Axios from 'axios'
// Vue插件是包含一个公开方法install的对象
// 将axios变为vue的插件，使其能够应用vue.use()方法
const http = {}
http.install = function (Vue) {
  // 统一设置基准路径
  Axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 为Vue实例挂载axios
  Vue.prototype.$http = Axios
}

export default http
