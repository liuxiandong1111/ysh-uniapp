import request from '../utils/request.js';

// 消息相关API
export default {
  // 获取用户消息列表
  getUserMsgList(data) {
    return request.post('/msg/get-user-msg-list', data);
  },
  
  // 标记消息已读
  markAsRead(msgId) {
    return request.post('/msg/mark-as-read', { msgId });
  },
  
  // 删除消息
  deleteMsg(msgId) {
    return request.post('/msg/delete-msg', { msgId });
  }
}; 