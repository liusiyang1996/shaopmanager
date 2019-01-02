import Vue from 'vue'
import Router from 'vue-router'

// 导入组件--@代表src文件夹
import login from '@/components/login.vue'
import home from '@/components/home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: home
    },
    {
      name: 'login',
      path: '/login',
      component: login
    }
  ]
})
