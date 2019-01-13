import Vue from 'vue'
import App from './App'
import router from './router/index'
// 引入element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 引入公共样式文件
import '@/assets/index.css'
// 引入配置好的插件
import http from './plugins/http'
// 引入moment
import moment from 'moment'
// 引入面包屑组件
import bread from '@/components/bread.vue'

// 定义过滤器 处理日期格式
Vue.filter('fmtDate', function (value) {
  return moment(value).format('YYYY-MM-DD')
})
// 使用Vue插件
Vue.use(ElementUI)
Vue.use(http)

// 注册全局组件
Vue.component(bread.name, bread)

// 生产模式下禁止报错
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
