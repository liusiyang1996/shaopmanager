import Vue from 'vue'
import App from './App'
import router from './router'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式文件
import '@/assets/index.css'
// 引入配置好的插件
import http from './plugins/http'

// 使用Vue插件
Vue.use(ElementUI)
Vue.use(http)

// 生产模式下禁止报错
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
