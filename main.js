import Vue from 'vue'
import App from './App'

// #ifndef VUE3
import './uni.promisify.adaptor'
Vue.config.productionTip = false

// 判断是否已登录，未登录则跳转到登录页
// const isLoggedIn = uni.getStorageSync('isLoggedIn') || true;
const isLoggedIn = true

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()

// 检查登录状态并跳转
if (!isLoggedIn) {
  setTimeout(() => {
    uni.redirectTo({
      url: '/pages/login/login'
    });
  }, 100);
}
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif