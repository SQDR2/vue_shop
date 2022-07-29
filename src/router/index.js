import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/LoginPage.vue'
import home from '../components/HomePage.vue'
import welcome from '../components/WelCome.vue'
import user from '../components/User/UserControl.vue'
import rigths from '../components/Permission/PermissionsList.vue'
import roles from '../components/Permission/RoleList.vue'
import categories from '../components/Goods/GoodCate.vue'
import goods from '../components/Goods/GoodList.vue'
import params from '../components/Goods/ParamMan.vue'
import add from '../components/Goods/AddGood.vue'
Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  {
    path: '/home',
    component: home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: welcome },
      { path: '/users', component: user },
      { path: '/rights', component: rigths },
      { path: '/roles', component: roles },
      { path: '/categories', component: categories },
      { path: '/goods', component: goods },
      { path: '/goods/add', component: add },
      { path: '/params', component: params }
    ]
  }
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
