import request from '../utils/request.js';

// 客户相关API
export default {
  // 获取客户列表
  getList(data) {
    return request.post('/client/get-client-list', data);
  },
  
  // 获取客户详情
  getDetail(id) {
    return request.get(`/client/get-client-detail?id=${id}`);
  },
  
  // 新增客户
  add(data) {
    return request.post('/client/add-client', data);
  },
  
  // 更新客户
  update(data) {
    return request.post('/client/save-client', data);
  },
  
  // 更新客户状态
  updateStatus(data) {
    return request.post('/client/update-client-status', data);
  }
}; 