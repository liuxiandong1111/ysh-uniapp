// 请求工具封装
const BASE_URL = 'http://test.yshcrm.com/api';
// const BASE_URL = 'https://yshcrm.com/api';
// 请求封装
const request = (url, method, data, showLoading = true) => {
  return new Promise((resolve, reject) => {
    if (showLoading) {
      uni.showLoading({
        title: '加载中...'
      });
    }

    // 获取存储的token
    const token = uni.getStorageSync('token') || '';

    uni.request({
      url: BASE_URL + url,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      success: (res) => {
        // 先判断状态码，处理特殊情况
        if (res.data.retCode === 401 || res.data.retCode == 4001) {
          // token过期或无效，跳转到登录页
          console.log('登录已过期，准备跳转到登录页');
          
          // 清除登录信息
          uni.removeStorageSync('token');
          uni.removeStorageSync('isLoggedIn');
          uni.removeStorageSync('userInfo');
          
          // 显示提示信息
          uni.showToast({
            title: '登录已过期，请重新登录',
            icon: 'none',
            duration: 2000
          });
          
          // 直接跳转到登录页，不使用setTimeout
          uni.redirectTo({
            url: '/pages/login/login'
          });
          
          reject({ message: '登录已过期，请重新登录' });
          return; // 确保不会继续执行下面的代码
        }
        
        // 正常情况下直接返回整个res.data，让业务代码判断success和处理数据
        resolve(res.data);
      },
      fail: (err) => {
        uni.showToast({
          title: '网络异常',
          icon: 'none'
        });
        reject(err);
      },
      complete: () => {
        if (showLoading) {
          uni.hideLoading();
        }
      }
    });
  });
};

// 封装常用请求方法
export default {
  get: (url, data = {}, showLoading = true) => {
    return request(url, 'GET', data, showLoading);
  },
  post: (url, data = {}, showLoading = true) => {
    return request(url, 'POST', data, showLoading);
  },
  put: (url, data = {}, showLoading = true) => {
    return request(url, 'PUT', data, showLoading);
  },
  delete: (url, data = {}, showLoading = true) => {
    return request(url, 'DELETE', data, showLoading);
  }
}; 