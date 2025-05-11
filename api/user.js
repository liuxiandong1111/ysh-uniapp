import request from '../utils/request.js';

// 用户相关API
export default {
  // 用户登录
  login(data) {
    return request.post('/user/login', data);
  },
  
  // 如果有其他用户相关API，可以在这里添加
  // 例如：获取用户信息
  // getUserInfo() {
  //   return request.get('/user/info');
  // }
}; 