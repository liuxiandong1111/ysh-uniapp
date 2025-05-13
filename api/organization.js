import request from '../utils/request.js';

// 部门相关API
export const department = {
  // 获取部门树列表
  getTreeList() {
    return request.post('/branch/get-branch-tree-list');
  },
  
  // 获取部门列表
  getList() {
    return request.post('/branch/get-branch-list');
  },
  
  // 添加部门
  add(data) {
    return request.post('/branch/add-branch-info', data);
  },
  
  // 更新部门
  update(data) {
    return request.post('/branch/save-branch-info', data);
  },
  
  // 删除部门
  delete(id) {
    return request.post('/branch/del-branch-info', { id });
  },
  
  // 设置部门权限
  setPermission(data) {
    return request.post('/branch/set-branch-power', data);
  }
};

// 员工相关API
export const employee = {
  // 获取员工列表
  getList(data) {
    return request.post('/user/get-user-list', data);
  },
  
  // 添加员工
  add(data) {
    return request.post('/user/register', data);
  },
  
  // 更新员工
  update(data) {
    return request.post('/user/save-user-info', data);
  },
  
  // 删除员工
  delete(id) {
    return request.post('/user/del-user', { id });
  },
  
  // 重置密码
  resetPassword(data) {
    return request.post('/user/change-password', data);
  }
};

// 职位相关API
export const position = {
  // 获取职位列表
  getList() {
    return request.post('/doc/get-rule-list');
  }
}; 