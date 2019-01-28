import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

// 导入组件--@代表src文件夹
// 实现路由懒加载
const login = () => import('@/components/login.vue')
const home = () => import('@/components/home.vue')
const users = () => import('@/components/users.vue')
const rights = () => import('@/components/rights.vue')
const roles = () => import('@/components/roles.vue')
const goodsList = () => import('@/components/goodslist.vue')
const goodsAdd = () => import('@/components/goodsAdd.vue')
const params = () => import('@/components/params.vue')
const goodsCate = () => import('@/components/goodscate.vue')
const order = () => import('@/components/order.vue')
const reports = () => import('@/components/reports.vue')

Vue.use(VueRouter)

const router = new VueRouter({
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
