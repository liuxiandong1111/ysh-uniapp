import request from '../utils/request.js';

// 贷款相关API
export default {
  // 获取贷款申请列表
  getFinanceList(data) {
    return request.post('/finance/get-finance-list', data);
  },
  
  // 获取贷款信息
  getLoanList(data) {
    return request.post('/finance/get-loan-list', data);
  },
  
  // 添加客户贷款
  addLoan(data) {
    return request.post('/finance/add-loan', data);
  },
  
  // 更新贷款状态
  updateLoanStatus(data) {
    return request.post('/finance/update-loan-status', data);
  },

  // 更新贷款状态
  financeSaveLoan(data) {
    return request.post('/finance/save-loan', data)
  },

  // 处理逾期贷款
  processOverdueLoan(data) {
    return request.post('/finance/handle-overdue', data);
  },
  
  // 获取贷款详情
  getLoanDetail(id) {
    return request.get(`/finance/get-loan-detail?id=${id}`);
  },
  
  // 获取贷款的还款计划
  getRepaymentSchedule(data) {
    return request.post(`/finance/get-loan-plan-list`, data);
  },

  // 获取贷款操作历史
  getOperationHistory(loanId) {
    return request.get(`/finance/get-operation-history?loanId=${loanId}`);
  }
}; 