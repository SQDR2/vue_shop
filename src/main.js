import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/font/iconfont.css'
import './assets/css/global.css'
import './plugins/element.js'
// 树形表格插件
import ZkTable from 'vue-table-with-tree-grid'
// 富文本编译器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 发请求前第一步
import axios from 'axios'
// 将axios挂载到vue上面
Vue.prototype.$http = axios
// 配置请求根路径
axios.defaults.baseURL = 'http://101.42.13.57:2581/api/private/v1/'
// 挂载之前配置token拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = sessionStorage.getItem('token')
  return config
})

import dayjs from 'dayjs';
Vue.prototype.$dayjs = dayjs;

Vue.use(ZkTable)
Vue.use(VueQuillEditor)
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
