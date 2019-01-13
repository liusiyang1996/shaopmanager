import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'

// 导入组件--@代表src文件夹
import login from '@/components/login.vue'
import home from '@/components/home.vue'
import users from '@/components/users.vue'
import rights from '@/components/rights.vue'
import roles from '@/components/roles.vue'
import goodsList from '@/components/goodslist.vue'
import goodsAdd from '@/components/goodsAdd.vue'
import params from '@/components/params.vue'
import goodsCate from '@/components/goodscate.vue'
import order from '@/components/order.vue'
import reports from '@/components/reports.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'home',
      path: '/',
      component: home,
      // 路由嵌套=>导航栏内容显示
      children: [
        {
          name: 'user',
          path: '/users',
          component: users
        },
        {
          name: 'rights',
          path: '/rights',
          component: rights
        },
        {
          name: 'roles',
          path: '/roles',
          component: roles
        },
        {
          name: 'goodsList',
          path: '/goods',
          component: goodsList
        },
        {
          name: 'goodsadd',
          path: '/goodsAdd',
          component: goodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component: params
        },
        {
          name: 'goodsCate',
          path: '/categories',
          component: goodsCate
        },
        {
          name: 'order',
          path: '/orders',
          component: order
        },
        {
          name: 'reports',
          path: '/reports',
          component: reports
        }
      ]
    },
    {
      name: 'login',
      path: '/login',
      component: login
    }
  ]
})

// 设置路由守卫拦截登录请求并判断token
router.beforeEach((to, from, next) => {
  if (to.name === 'home') {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push({
        name: 'login'
      })
      Message.warning('请先登录')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
