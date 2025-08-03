<template>
	<view class="container">
		<!-- 客户信息卡片 -->
		<view class="customer-card">
			<view class="customer-info">
				<text class="customer-name">{{ customerInfo.name || '未知客户' }}</text>
				<view class="customer-phone">{{ customerInfo.phone || '未知手机号' }}</view>
			</view>
			<view class="current-status">
				<text class="status-label">当前状态:</text>
				<text class="status-value" :class="'statusClass-' + (customerInfo.status || 1)">
					{{ dictMaps.customerStatus[customerInfo.status] || '未知状态' }}
				</text>
			</view>
		</view>
		
		<!-- 状态选择表单 -->
		<view class="form-container">
			<view class="form-title">请选择新的客户状态</view>
			<view class="status-options">
				<view 
					v-for="(item, index) in customerStatusOptions" 
					:key="index"
					:class="['status-option', { active: statusForm.status === item.value }]"
					@click="selectStatus(item.value)"
				>
					<text class="status-icon" :class="'statusClass-' + item.value"></text>
					<text class="status-name">{{ item.label }}</text>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="btn btn-default" @click="goBack">取消</button>
			<button class="btn btn-primary" @click="submitStatusUpdate">确认更新</button>
		</view>
	</view>
</template>

<script>
	import customerApi from '@/api/customer.js';
	import { dictMaps } from '@/utils/dict.js';
	
	export default {
		data() {
			console.log('status.vue - 组件初始化');
			return {
				customerId: '',
				customerInfo: {},
				statusForm: {
					id: '',
					status: ''
				},
				customerStatusOptions: [
					{ value: '1', label: '未联系' },
					{ value: '2', label: '电话联系' },
					{ value: '3', label: '客户到访' },
					{ value: '4', label: '提交材料' },
					{ value: '5', label: '完成' }
				],
				dictMaps: dictMaps
			}
		},
		onLoad(options) {
			console.log('status.vue - onLoad被调用');
			console.log('status页面接收到的参数:', options);
			if (options.id) {
				this.customerId = options.id;
				this.statusForm.id = options.id;
				
				// 尝试解析传入的客户数据
				if (options.customerData) {
					try {
						const customerData = JSON.parse(decodeURIComponent(options.customerData));
						this.customerInfo = customerData;
						this.statusForm.status = customerData.status || '';
						console.log('使用传入的客户数据:', this.customerInfo);
					} catch (error) {
						console.error('解析客户数据失败:', error);
						// 解析失败时通过API获取
						this.loadCustomerInfo();
					}
				} else {
					// 没有传入客户数据，则通过API获取
					this.loadCustomerInfo();
				}
			}
		},
		methods: {
			loadCustomerInfo() {
				
				customerApi.getDetail(this.customerId).then(res => {
					if (res.retCode === 200 && res.data) {
						this.customerInfo = res.data;
						this.statusForm.status = res.data.status || '';
					} else {
						uni.showToast({
							title: res.message || '获取客户信息失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
					console.error('获取客户信息失败', err);
				});
			},
			
			selectStatus(status) {
				this.statusForm.status = status;
			},
			
			submitStatusUpdate() {
				if (!this.statusForm.status) {
					uni.showToast({
						title: '请选择客户状态',
						icon: 'none'
					});
					return;
				}
				
				// 调用API更新客户状态
				customerApi.clientSaveClientStatus({
					id: this.statusForm.id,
					status: this.statusForm.status
				}).then(res => {
					
					if (res.success && res.retCode === 200) {
						uni.showToast({
							title: '状态更新成功',
							icon: 'success'
						});
						
						// 更新成功后返回上一页
						setTimeout(() => {
							uni.navigateBack({
								delta: 1,
								success: function() {
									// 通过事件通知列表页刷新数据
									uni.$emit('refreshCustomerList');
								}
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.message || '状态更新失败',
							icon: 'none'
						});
					}
				}).catch(err => {
					
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
					
					console.error('更新客户状态失败', err);
				});
			},
			
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
	}
	
	.navbar {
		display: flex;
		height: 90rpx;
		padding: 90rpx 30rpx 0;
		justify-content: space-between;
		align-items: center;
		background-color: #409EFF;
		color: #FFFFFF;
		position: relative;
	}
	
	.navbar-left {
		width: 80rpx;
		display: flex;
		align-items: center;
	}
	
	.icon-back {
		font-size: 36rpx;
	}
	
	.navbar-title {
		font-size: 24rpx;
		font-weight: 400;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.navbar-right {
		width: 80rpx;
	}
	
	.customer-card {
		margin: 30rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
	}
	
	.customer-info {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
	}
	
	.customer-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 10rpx;
	}
	
	.customer-phone {
		font-size: 28rpx;
		color: #666;
	}
	
	.current-status {
		display: flex;
		align-items: center;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1px solid #eee;
	}
	
	.status-label {
		font-size: 28rpx;
		color: #666;
		margin-right: 20rpx;
	}
	
	.status-value {
		font-size: 28rpx;
		padding: 4rpx 16rpx;
		border-radius: 20rpx;
		color: white;
	}
	
	.form-container {
		margin: 0 30rpx 30rpx;
		padding: 30rpx;
		background-color: #ffffff;
		border-radius: 12rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
		flex: 1;
	}
	
	.form-title {
		font-size: 32rpx;
		color: #333;
		margin-bottom: 30rpx;
		font-weight: bold;
	}
	
	.status-options {
		display: flex;
		flex-direction: column;
	}
	
	.status-option {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		border-bottom: 1px solid #f5f5f5;
	}
	
	.status-option.active {
		background-color: #f0f9ff;
	}
	
	.status-icon {
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		margin-right: 20rpx;
	}
	
	.status-name {
		font-size: 30rpx;
		color: #333;
	}
	
	.footer {
		padding: 30rpx;
		display: flex;
		justify-content: space-between;
	}
	
	.btn {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
	
	.btn-default {
		background-color: #f5f5f5;
		color: #666;
		margin-right: 20rpx;
	}
	
	.btn-primary {
		background-color: #409EFF;
		color: #fff;
	}
	
	.statusClass-1 {
		background-color: #5ac8fa; /* 未联系 - 蓝色 */
	}
	
	.statusClass-2 {
		background-color: #ff9500; /* 电话联系 - 橙色 */
	}
	
	.statusClass-3 {
		background-color: #4cd964; /* 客户到访 - 绿色 */
	}
	
	.statusClass-4 {
		background-color: #8e8e93; /* 提交材料 - 灰色 */
	}
	
	.statusClass-5 {
		background-color: #007AFF; /* 完成 - 深蓝色 */
	}
</style> 