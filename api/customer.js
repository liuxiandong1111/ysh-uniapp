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
  },

  // 删除客户
  deleteCustomer (id) {
    return request.delete(`/api/customers/${id}`)
  },

  // 获取客户跟进记录
  getCustomerRecords(id) {
    return request.post(`/client/get-client-log`, {id})
  },

  // 添加客户跟进记录
  addCustomerRecord(data) {
    return request.post(`/client/add-client-log`, data)
  },

  // 移交产品部
  clientTurnOverProduct (data) {
    return request.post(`/client/turn-over-product`, data)
  },

  // 更新客户状态
  clientSaveClientStatus (data) {
    return request.post(`/client/save-client-status`, data)
  },

  // 获取贷款信息
  getloanList(data) {
    return request.post('/finance/get-loan-list', data)
  },

  // 上传 文件
  docUpload(data) {
    return request.post('/doc/upload', data)
  } 
}; 