import Vue from 'vue'
import App from './App'

// #ifndef VUE3
import './uni.promisify.adaptor'
Vue.config.productionTip = false

// 判断是否已登录，未登录则跳转到登录页
const isLoggedIn = uni.getStorageSync('isLoggedIn') || false;
const token = uni.getStorageSync('token') || '';

// 添加全局方法
Vue.prototype.checkLogin = function() {
  const isLoggedIn = uni.getStorageSync('isLoggedIn');
  const token = uni.getStorageSync('token');
  const userInfo = uni.getStorageSync('userInfo');
  
  if (!isLoggedIn || !token || !userInfo) {
    console.log('未登录或token不存在，准备跳转到登录页');
    
    // 显示提示
    uni.showToast({
      title: '请先登录',
      icon: 'none',
      duration: 2000
    });
    
    // 直接跳转到登录页
    uni.redirectTo({
      url: '/pages/login/login'
    });
    
    return false;
  }
  return true;
}

App.mpType = 'app'

const app = new Vue({
  ...App
})

app.$mount()

// 检查登录状态并跳转
if (!isLoggedIn || !token) {
  console.log('应用启动时检测到未登录，准备跳转到登录页');
  
  // 直接跳转
  uni.redirectTo({
    url: '/pages/login/login'
  });
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