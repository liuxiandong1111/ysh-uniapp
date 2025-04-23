<template>
  <view class="followup-container">
    <view class="customer-info-card">
      <view class="customer-name">{{customerInfo.name}}</view>
      <view class="customer-phone">{{customerInfo.phone}}</view>
      <view class="customer-status" :class="'statusClass-' + customerInfo.status">
        <text>{{getStatusText(customerInfo.status)}}</text>
      </view>
    </view>
    
    <!-- 跟进记录列表 -->
    <view class="followup-list">
      <view class="followup-list-title">
        <uni-icons type="chatbubble" size="18"></uni-icons>
        <text>跟进记录</text>
      </view>
      <view class="timeline">
        <view class="timeline-item" v-for="(item, index) in followupList" :key="index">
          <view class="timeline-item-dot"></view>
          <view class="timeline-item-content">
            {{ item.content }}
            <view class="timeline-item-header">
              <view class="timeline-item-time">{{item.createTime}}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 添加跟进记录表单 -->
    <view class="add-followup-form">
      <view class="form-title">添加跟进记录</view>
      <view class="form-item">
        <view class="form-item-content">
          <textarea v-model="formData.content" placeholder="请输入跟进内容" />
        </view> 
      </view>
      <view class="form-buttons">
        <button class="btn btn-cancel" @click="goBack">取消</button>
        <button class="btn btn-submit" @click="submitFollowup">确定</button>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      customerId: null,
      customerInfo: {
        name: '',
        phone: '',
        status: 'new'
      },
      followupList: [],
      formData: {
        content: '',
        nextTime: ''
      }
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.customerId = options.id;
      this.loadCustomerInfo();
      this.loadFollowupList();
    }
  },
  methods: {
    // 获取客户信息
    loadCustomerInfo() {
      // 模拟从服务器获取客户信息
      // 实际项目中应该从API获取
      this.customerInfo = {
        id: this.customerId,
        name: '张三',
        phone: '13800138000',
        status: 'intention'
      };
    },
    
    // 获取跟进记录列表
    loadFollowupList() {
      // 模拟从服务器获取跟进记录
      // 实际项目中应该从API获取
      this.followupList = [
        {
          id: '1',
          content: '客户对我们的产品表示很感兴趣，计划下周再次沟通细节',
          createTime: '2025-04-15 14:30',
          creatorName: '李四',
          nextTime: '2025-04-22'
        },
        {
          id: '2',
          content: '已与客户确认了产品配置和价格，客户考虑中',
          createTime: '2025-04-10 10:15',
          creatorName: '王五',
          nextTime: '2025-04-15'
        }
      ];
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        'new': '新客户',
        'intention': '意向客户',
        'signed': '已签约',
        'lost': '已流失',
        'public': '公海客户'
      };
      return statusMap[status] || status;
    },
    
    // 日期选择变更
    onDateChange(e) {
      this.formData.nextTime = e.detail.value;
    },
    
    // 提交跟进记录
    submitFollowup() {
      if (!this.formData.content) {
        uni.showToast({
          title: '请输入跟进内容',
          icon: 'none'
        });
        return;
      }
      
      // 模拟提交到服务器
      // 实际项目中应该调用API提交
      console.log('提交跟进记录', {
        customerId: this.customerId,
        content: this.formData.content,
        nextTime: this.formData.nextTime
      });
      
      // 提交成功后重新加载列表并清空表单
      const newRecord = {
        id: Date.now().toString(),
        content: this.formData.content,
        createTime: new Date().toLocaleString(),
        creatorName: '当前用户',
        nextTime: this.formData.nextTime
      };
      
      this.followupList.unshift(newRecord);
      this.formData = {
        content: '',
        nextTime: ''
      };
      
      uni.showToast({
        title: '添加成功',
        icon: 'success'
      });
    },
    
    // 返回上一页
    goBack() {
      uni.navigateBack();
    }
  }
}
</script>

<style>
.followup-container {
  padding: 20rpx;
  background-color: #f5f5f5;
  min-height: 100vh;
}

.customer-info-card {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  position: relative;
}

.customer-name {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.customer-phone {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 10rpx;
}

.customer-status {
  display: inline-block;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
  position: absolute;
  right: 20rpx;
  top: 20rpx;
}

.statusClass-new {
  background-color: #e6f7ff;
  color: #1890ff;
}

.statusClass-intention {
  background-color: #fff7e6;
  color: #fa8c16;
}

.statusClass-signed {
  background-color: #f6ffed;
  color: #52c41a;
}

.statusClass-lost {
  background-color: #fff1f0;
  color: #f5222d;
}

.statusClass-public {
  background-color: #f5f5f5;
  color: #8c8c8c;
}

.followup-list {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.followup-list-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
}

.followup-list-title text {
  margin-left: 10rpx;
}

.timeline {
  padding: 10rpx 0;
}

.timeline-item {
  position: relative;
  padding-left: 40rpx;
  padding-bottom: 30rpx;
  border-left: 2rpx solid #e8e8e8;
}

.timeline-item:last-child {
  border-left: 2rpx solid transparent;
}

.timeline-item-dot {
  position: absolute;
  left: -10rpx;
  top: 0;
  width: 16rpx;
  height: 16rpx;
  background-color: #1890ff;
  border-radius: 50%;
}

.timeline-item-content {
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 16rpx;
}

.timeline-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10rpx;
}

.timeline-item-time {
  font-size: 24rpx;
  color: #999;
}

.timeline-item-user {
  font-size: 24rpx;
  color: #666;
}

.timeline-item-body {
  font-size: 28rpx;
}

.timeline-item-content-text {
  margin-bottom: 10rpx;
  line-height: 1.5;
}

.timeline-item-next-time {
  font-size: 24rpx;
  color: #1890ff;
}

.add-followup-form {
  background-color: #fff;
  border-radius: 10rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.form-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.form-item {
  margin-bottom: 20rpx;
}

.form-item-label {
  font-size: 28rpx;
  margin-bottom: 10rpx;
}

.form-item-content textarea {
  width: 100%;
  height: 200rpx;
  background-color: #f9f9f9;
  border-radius: 6rpx;
  padding: 16rpx;
  font-size: 28rpx;
}

.picker-text {
  height: 80rpx;
  line-height: 80rpx;
  background-color: #f9f9f9;
  border-radius: 6rpx;
  padding: 0 16rpx;
  font-size: 28rpx;
}

.form-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 20rpx;
}

.btn {
  font-size: 28rpx;
  border-radius: 6rpx;
  margin-left: 20rpx;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-submit {
  background-color: #1890ff;
  color: #fff;
}
</style> 