<template>
	<view class="container">
        <button class="btn-create" @click="handleCreate">+</button>
		<view class="loan-list">
			<view v-if="isLoading" class="loading-container">
				<text>加载中...</text>
			</view>
			
			<view v-else-if="hasError" class="error-container">
				<text>{{ errorMsg }}</text>
				<button class="retry-btn" @click="loadLoanList">重试</button>
			</view>
			
			<view v-else-if="loanList.length === 0" class="empty-tip">
				<text>暂无贷款记录</text>
			</view>
			
			<view v-else class="loan-card" v-for="(item, index) in loanList" :key="index">
				<view class="loan-header">
					<text class="loan-name">{{ item.name }}</text>
					<view class="loan-status" :class="'status-' + getStatusClass(item.status)">
						<text>{{ getLoanStatus(item.status) }}</text>
					</view>
				</view>
				
				<view class="loan-info">
					<view class="info-row">
						<text class="info-label">贷款类型:</text>
						<text class="info-value">{{ item.type == 1 ? '消费' : '经营' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">期限(年):</text>
						<text class="info-value">{{ item.age_limit }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">详细进度</text>
						<text class="info-value" style="color: #409EFF;" @click="viewProgress(item)">查看</text>
					</view>
					<view class="info-row">
						<text class="info-label">还款方式:</text>
						<text class="info-value">{{ getDueType(item.due_type)}}</text>
					</view>
					<view class="info-row">
						<text class="info-label">放款时间:</text>
						<text class="info-value">{{ item.loan_date || '-' }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">额度:</text>
						<text class="info-value">{{ item.quota }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">利率:</text>
						<text class="info-value">{{ item.rate }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">还款状态:</text>
						<view class="repayment-status" :class="'repayment-' + getRepaymentClass(item.is_yu)">
							<text>{{ item.is_yu == 0 ? '正常' : '逾期' }}</text>
						</view>
					</view>
					<view class="info-row" v-if="item.cause">
						<text class="info-label">拒绝原因:</text>
						<text class="info-value reject-reason">{{ item.cause }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">渠道:</text>
						<text class="info-value">{{ item.channel }}</text>
					</view>
				</view>
				
				<view class="loan-actions">
					<view class="action-btn" @click="handleView(item)">
						<text class="btn-text">详情</text>
					</view>
					<view class="action-btn" @click="handleOverdue(item)" v-if="item.status == 2">
						<text class="btn-text">逾期处理</text>
					</view>
					<view class="action-btn" @click="updateLoanStatus(item)" v-if="item.status == 1">
						<text class="btn-text">更新进度</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import financeApi from '@/api/finance.js';
	import { approvalStatus } from '@/utils/dict.js';
	export default {
		data() {
			return {
				customerId: null,
				customerData: null,
				customerName: '',
				loanList: [],
				isLoading: false,
				hasError: false,
				errorMsg: ''
			}
		},
		onLoad(options) {
			if (options.id) {
				this.customerId = options.id;
				const customerData = JSON.parse(decodeURIComponent(options.customerData));
				this.customerData = customerData;
				this.loadLoanList();
			}
		},
		onShow() {
			// 每次页面显示时刷新贷款列表
			this.loadLoanList();
		},
		methods: {
			// 加载贷款列表
			async loadLoanList() {
				// 设置加载状态
				this.isLoading = true;
				this.hasError = false;
				this.errorMsg = '';
				
				// 显示加载提示
				uni.showLoading({
					title: '加载中...'
				});
				
				try {
					const params = {
						client_id: this.customerId,
						page: 1,
						page_size: 30
					};
					
					// 调用API获取贷款列表
					const res = await financeApi.getLoanList(params);
					
					// 隐藏加载提示
					uni.hideLoading();
					
					if (res && res.retCode === 200) {
						this.loanList = res.data.list || [];
						
						if (this.loanList.length === 0) {
							uni.showToast({
								title: '暂无贷款记录',
								icon: 'none'
							});
						}
					} else {
						this.hasError = true;
						this.errorMsg = res.retMsg || '获取贷款列表失败';
						
						uni.showToast({
							title: this.errorMsg,
							icon: 'none'
						});
					}
				} catch (error) {
					// 隐藏加载提示
					uni.hideLoading();
					
					this.hasError = true;
					this.errorMsg = '获取贷款列表失败';
					
					uni.showToast({
						title: this.errorMsg,
						icon: 'none'
					});
					
					console.error('获取贷款列表失败:', error);
				} finally {
					this.isLoading = false;
				}
			},
			
			// 获取状态样式类
			getStatusClass(status) {
				const statusMap = {
					'1': 'pending',
					'2': 'approved',
					'3': 'rejected'
				};
				return statusMap[status] || 'pending';
			},

			getLoanStatus (status) {
				return approvalStatus.find(item => item.value == status)?.label || '';
			},
			
			// 获取还款状态样式类
			getRepaymentClass(status) {
				const statusMap = {
					'0': 'normal',
					'1': 'overdue'
				};
				return statusMap[status] || 'normal';
			},
			
			// 处理创建贷款
			handleCreate() {
				// 跳转到贷款创建页面
				const customerData = encodeURIComponent(JSON.stringify(this.customerData));
				uni.navigateTo({
					url: `/pages/loan/create?customerData=${customerData}`
				});
			},
			
			// 查看贷款详情
			handleView(item) {
				const loanData = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: `/pages/loan/detail?id=${item.id}&loanData=${loanData}&type=loan`
				});
			},
			
			// 处理逾期
			handleOverdue(item) {
				uni.navigateTo({
					url: `/pages/loan/overdue?id=${item.id}`
				});
			},
			
			// 更新贷款状态
			updateLoanStatus(item) {
				uni.navigateTo({
					url: `/pages/loan/status?id=${item.id}`
				});
			},

			getDueType(type) {
				switch (Number(type)) {
					case 1: return '等额本息'
					case 2: return '先息后本'
					case 3: return '随借随还'
					default: return '未知'
				}
			},
			viewProgress (row) {
				const loanData = encodeURIComponent(JSON.stringify(row));
				console.log(loanData, 'loanData')
				uni.navigateTo({
					url: `/pages/loan/progress?loanData=${loanData}&type=loan`
				});
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 15px;
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	
	.header-title {
		font-size: 18px;
		font-weight: bold;
		color: #303133;
	}
	
	.btn-create {
		background-color: #409EFF;
		color: white;
		border-radius: 25px;
		font-size: 28px;
        position: fixed;
        right: 15px;
        bottom: 15px;
        width: 50px;
        height: 50px;
        line-height: 50px;
	}
	
	.loan-list {
		margin-bottom: 20px;
	}
	
	.empty-tip {
		background-color: #fff;
		border-radius: 8px;
		padding: 30px;
		text-align: center;
		color: #909399;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.loading-container {
		background-color: #fff;
		border-radius: 8px;
		padding: 30px;
		text-align: center;
		color: #409EFF;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.error-container {
		background-color: #fff;
		border-radius: 8px;
		padding: 30px;
		text-align: center;
		color: #f56c6c;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	
	.retry-btn {
		margin-top: 15px;
		background-color: #409EFF;
		color: white;
		border-radius: 4px;
		padding: 6px 15px;
		font-size: 14px;
	}
	
	.loan-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 15px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.loan-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 12px;
	}
	
	.loan-name {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}
	
	.loan-status {
		font-size: 12px;
		padding: 4px 8px;
		border-radius: 4px;
		color: white;
	}
	
	.status-pending {
		background-color: #e6a23c;
	}
	
	.status-processing {
		background-color: #409EFF;
	}
	
	.status-approved {
		background-color: #67c23a;
	}
	
	.status-rejected {
		background-color: #f56c6c;
	}
	
	.loan-info {
		margin-bottom: 15px;
	}
	
	.info-row {
		display: flex;
		margin-bottom: 8px;
		font-size: 14px;
		align-items: center;
	}
	
	.info-label {
		color: #909399;
		width: 80px;
		flex-shrink: 0;
	}
	
	.info-value {
		color: #606266;
		flex: 1;
	}
	
	.repayment-status {
		padding: 2px 6px;
		border-radius: 4px;
		font-size: 12px;
		display: inline-block;
	}
	
	.repayment-normal {
		background-color: #f0f9eb;
		color: #67c23a;
	}
	
	.repayment-cleared {
		background-color: #ecf5ff;
		color: #409EFF;
	}
	
	.repayment-overdue {
		background-color: #fef0f0;
		color: #f56c6c;
	}
	
	.repayment-unpaid {
		background-color: #f4f4f5;
		color: #909399;
	}
	
	.reject-reason {
		color: #f56c6c;
	}
	
	.loan-actions {
		display: flex;
		border-top: 1px solid #ebeef5;
		padding-top: 12px;
	}
	
	.action-btn {
		flex: 1;
		text-align: center;
	}
	
	.btn-text {
		font-size: 14px;
		color: #409EFF;
	}
</style> 