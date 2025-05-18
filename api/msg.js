import request from '../utils/request.js';

// 获取用户消息列表
function getUserMsgList(params) {
  return request.post('/msg/get-user-msg-list', params);
}

// 处理消息（删除/标记已读）
function handleUserMsg(data) {
  return request.post('/msg/save-user-msg', data);
}

// 获取未读消息
function getUserNoReadMsgList() {
  return request.post('/msg/get-user-no-read-msg-list');
}

// 统一默认导出
export default {
  getUserMsgList,
  handleUserMsg,
  getUserNoReadMsgList
}; 