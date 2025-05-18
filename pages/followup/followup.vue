<template>
  <view class="followup-container">
    <view class="customer-info-card">
      <view class="customer-name">{{customerInfo.name}}</view>
      <view class="customer-phone">{{customerInfo.phone}}</view>
      <!-- <view class="customer-status" :class="'statusClass-' + customerInfo.status">
        <text>{{getStatusText(customerInfo.status)}}</text>
      </view> -->
    </view>
    
    <!-- 跟进记录列表 -->
    <view class="followup-list">
      <view class="followup-list-title">
        <uni-icons type="chatbubble" size="18"></uni-icons>
        <text>跟进记录</text>
      </view>
      <view class="timeline" v-if="followupList.length > 0">
        <view class="timeline-item" v-for="(item, index) in followupList" :key="index">
          <view class="timeline-item-dot"></view>
          <view class="timeline-item-content">
            {{ item.info }}
            <view class="timeline-item-header">
              <view class="timeline-item-time">{{item.ctime}}</view>
            </view>
          </view>
        </view>
      </view>
      <view class="empty-records" v-else>
        <text>暂无跟进记录</text>
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
import customerApi from '@/api/customer.js';

export default {
  data() {
    return {
      customerId: null,
      customerInfo: {
        name: '',
        phone: '',
        status: ''
      },
      followupList: [],
      formData: {
        content: ''
      },
      loading: false
    }
  },
  onLoad(options) {
    if (options && options.id) {
      this.customerId = options.id;
      
      // 尝试解析传入的客户数据
      if (options.customerData) {
        try {
          const customerData = JSON.parse(decodeURIComponent(options.customerData));
          this.customerInfo = customerData;
          console.log('使用传入的客户数据:', this.customerInfo);
        } catch (error) {
          console.error('解析客户数据失败:', error);
        }
      }
      
      // 获取跟进记录
      this.loadFollowupList();
    }
  },
  methods: {
    // 获取跟进记录列表
    loadFollowupList() {
      if (!this.customerId) return;
      
      this.loading = true;
      
      // 调用API获取跟进记录
      customerApi.getCustomerRecords(this.customerId).then(res => {
        this.loading = false;
        if (res.success && res.retCode === 200) {
          // 数据可能是空数组，这是正常情况
          this.followupList = Array.isArray(res.data) ? res.data : [];
          
          if (this.followupList.length === 0) {
            console.log('暂无跟进记录');
          }
        } else {
          uni.showToast({
            title: res.message || '获取跟进记录失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        this.loading = false;
        uni.showToast({
          title: '获取跟进记录失败',
          icon: 'none'
        });
        console.error('获取跟进记录失败', err);
      });
    },
    
    // 获取状态文本
    getStatusText(status) {
      const statusMap = {
        '1': '新客户',
        '2': '意向客户',
        '3': '已签约',
        '4': '已流失',
        '5': '公海客户'
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
      
      // 防止重复提交
      if (this.loading) return;
      this.loading = true;
      
      // 调用API提交跟进记录
      customerApi.addCustomerRecord({
        id: this.customerId,
        info: this.formData.content
      }).then(res => {
        this.loading = false;
        if (res.success && res.retCode === 200) {
          uni.showToast({
            title: '添加成功',
            icon: 'success'
          });
          
          // 清空表单
          this.formData.content = '';
          
          // 重新加载跟进记录
          this.loadFollowupList();
        } else {
          uni.showToast({
            title: res.message || '添加失败',
            icon: 'none'
          });
        }
      }).catch(err => {
        this.loading = false;
        uni.showToast({
          title: '添加失败',
          icon: 'none'
        });
        console.error('添加跟进记录失败', err);
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

.statusClass-1 {
  background-color: #e6f7ff;
  color: #1890ff;
}

.statusClass-2 {
  background-color: #fff7e6;
  color: #fa8c16;
}

.statusClass-3 {
  background-color: #f6ffed;
  color: #52c41a;
}

.statusClass-4 {
  background-color: #fff1f0;
  color: #f5222d;
}

.statusClass-5 {
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
  background-color: #409EFF;
  border-radius: 50%;
}

.timeline-item-content {
  background-color: #f9f9f9;
  border-radius: 8rpx;
  padding: 16rpx;
  line-height: 1.5;
  font-size: 28rpx;
}

.timeline-item-header {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
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
  padding: 0 30rpx;
  height: 70rpx;
  line-height: 70rpx;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #666;
}

.btn-submit {
  background-color: #409EFF;
  color: #fff;
}

.empty-records {
  padding: 40rpx 0;
  text-align: center;
  color: #909399;
  font-size: 28rpx;
  background-color: #f9f9f9;
  border-radius: 8rpx;
}
</style> 