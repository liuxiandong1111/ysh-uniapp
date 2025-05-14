<template>
	<view class="container">
		<!-- 移交内容 -->
		<view class="transfer-container">
			<view class="transfer-card">
				<view class="transfer-message">
					确定将客户 <text class="customer-name">{{ customerName }}</text> 移交给产品部处理吗？
				</view>
				
				<view class="form-item">
					<text class="form-label">产品经理</text>
					<picker :range="productManagers" range-key="name" @change="handleManagerChange" class="form-picker" :disabled="isLoading">
						<view class="picker-value" v-if="!isLoading">{{ selectedManager ? selectedManager.name : '请选择产品经理' }}</view>
						<view class="picker-value" v-else>加载中...</view>
					</picker>
				</view>
				
				<view class="form-item">
					<text class="form-label">备注</text>
					<textarea class="form-textarea" v-model="remark" placeholder="请输入备注信息"></textarea>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="btn btn-default" @click="goBack">取消</button>
			<button class="btn btn-primary" @click="submitTransfer">确认移交</button>
		</view>
	</view>
</template>

<script>
	import { employee } from '@/api/organization.js';
	import customerApi from '@/api/customer.js';
	
	export default {
		data() {
			return {
				customerId: '',
				customerName: '',
				productManagers: [],
				selectedManagerId: null,
				selectedManager: null,
				remark: '',
				isLoading: false,
				isSubmitting: false
			}
		},
		onLoad(options) {
			if (options.id) {
				this.customerId = options.id;
				
				// 尝试解析传入的客户数据
				if (options.customerData) {
					try {
						const customerData = JSON.parse(decodeURIComponent(options.customerData));
						this.customerName = customerData.name || '未知客户';
						console.log('使用传入的客户数据:', customerData.name);
					} catch (error) {
						console.error('解析客户数据失败:', error);
						// 解析失败时通过模拟或API获取
						this.loadCustomerInfo();
					}
				} else {
					// 没有传入客户数据，则通过模拟或API获取
					this.loadCustomerInfo();
				}
				
				// 加载产品经理列表
				this.loadProductManagers();
			} else {
				uni.showToast({
					title: '客户ID不能为空',
					icon: 'none'
				});
				setTimeout(() => {
					uni.navigateBack();
				}, 1500);
			}
		},
		methods: {
			loadCustomerInfo() {
				// 模拟从API获取客户信息
				setTimeout(() => {
					// 模拟数据
					if (this.customerId === '1') {
						this.customerName = '张三';
					} else if (this.customerId === '2') {
						this.customerName = '李四';
					} else if (this.customerId === '3') {
						this.customerName = '王五';
					} else {
						this.customerName = '客户' + this.customerId;
					}
				}, 500);
				
				// 实际项目中使用API调用
				// uni.request({
				//   url: 'your_api_endpoint/customer/' + this.customerId,
				//   method: 'GET',
				//   success: (res) => {
				//     this.customerName = res.data.name;
				//   },
				//   fail: () => {
				//     uni.showToast({
				//       title: '获取客户信息失败',
				//       icon: 'none'
				//     });
				//     setTimeout(() => {
				//       uni.navigateBack();
				//     }, 1500);
				//   }
				// });
			},
			
			// 获取产品经理列表
			async loadProductManagers() {
				this.isLoading = true;
				try {
					const res = await employee.getList({
						rule_id: 2,
						page: 1,
						pageSize: 100
					});
					
					if (res && res.data && res.data.list) {
						this.productManagers = res.data.list;
					} else {
						this.productManagers = [];
						uni.showToast({
							title: '获取产品经理列表为空',
							icon: 'none'
						});
					}
				} catch (error) {
					this.productManagers = [];
					uni.showToast({
						title: '获取产品经理列表失败',
						icon: 'none'
					});
				} finally {
					this.isLoading = false;
				}
			},
			
			handleManagerChange(e) {
				const index = e.detail.value;
				this.selectedManager = this.productManagers[index];
				this.selectedManagerId = this.selectedManager.id;
			},
			validateForm() {
				if (!this.selectedManagerId) {
					uni.showToast({
						title: '请选择产品经理',
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			async submitTransfer() {
				if (!this.validateForm()) {
					return;
				}
				
				// 准备提交的数据
				const formData = {
					id: this.customerId,
					deal_id: this.selectedManagerId.toString(),
					descr: this.remark
				};
				
				this.isSubmitting = true;
				uni.showLoading({
					title: '处理中...'
				});
				
				try {
					const res = await customerApi.clientTurnOverProduct(formData);
					
					if (res && res.retCode === 200) {
						uni.showToast({
							title: `客户${this.customerName}移交成功`,
							icon: 'success'
						});
						
						// 返回上一页
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: res.retMsg || '移交失败，请重试',
							icon: 'none'
						});
					}
				} catch (error) {
					uni.showToast({
						title: '移交失败，请重试',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
					this.isSubmitting = false;
				}
			},
			goBack() {
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
	}
	
	.navbar {
		display: flex;
		height: 90rpx;
		padding: 0 30rpx;
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
		font-size: 36rpx;
		font-weight: 500;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.navbar-right {
		width: 80rpx;
	}
	
	.transfer-container {
		flex: 1;
		padding: 40rpx 30rpx;
		display: flex;
		flex-direction: column;
	}
	
	.transfer-card {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-bottom: 30rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	.transfer-message {
		font-size: 32rpx;
		color: #303133;
		margin-bottom: 40rpx;
		line-height: 1.5;
	}
	
	.customer-name {
		font-weight: bold;
		color: #409EFF;
	}
	
	.form-item {
		margin-bottom: 30rpx;
	}
	
	.form-label {
		display: block;
		font-size: 28rpx;
		color: #606266;
		margin-bottom: 15rpx;
	}
	
	.form-picker {
		width: 100%;
		height: 80rpx;
		border: 1px solid #dcdfe6;
		border-radius: 4rpx;
		font-size: 28rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	.picker-value {
		color: #333;
	}
	
	.form-textarea {
		width: 100%;
		height: 200rpx;
		border: 1px solid #dcdfe6;
		border-radius: 4rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		box-sizing: border-box;
	}
	
	.footer {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #fff;
		border-top: 1px solid #ebeef5;
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
		background-color: #f2f6fc;
		color: #606266;
		margin-right: 20rpx;
	}
	
	.btn-primary {
		background-color: #409EFF;
		color: #fff;
	}
</style> 