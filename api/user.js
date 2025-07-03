import request from '../utils/request.js';

// 用户相关API
export default {
  // 用户登录
  login(data) {
    return request.post('/user/login', data);
  },
  
  // 获取用户菜单权限树
  getMenuTree() {
    return request.post('/user/get-menu-tree-list');
  },
  
  // 重置密码
  resetPassword(data) {
    return request.post('/user/change-password', data);
  }
};