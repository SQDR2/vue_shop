import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/LoginPage.vue'
import home from '../components/HomePage.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home }
]

const router = new VueRouter({
  routes
})
// 挂载路由守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from代表从哪个路径跳转而来
  // next是一个函数，表示放行
  // next()放行
  // next('/login')强制跳转
  // 登录页面所有人都可以进入
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  // 没有token 强制跳转到登录页面
  if (!tokenStr) return next('/login')
  next()
})
export default router
