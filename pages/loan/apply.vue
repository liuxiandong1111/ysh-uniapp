<template>
	<view class="container">
        <button class="btn-create" @click="handleCreate">+</button>
		<view class="loan-list">
			<view v-if="loanList.length === 0" class="empty-tip">
				<text>暂无贷款记录</text>
			</view>
			
			<view v-else class="loan-card" v-for="(item, index) in loanList" :key="index">
				<view class="loan-header">
					<text class="loan-name">{{ item.name }}</text>
					<view class="loan-status" :class="'status-' + getStatusClass(item.status)">
						<text>{{ item.status }}</text>
					</view>
				</view>
				
				<view class="loan-info">
					<view class="info-row">
						<text class="info-label">贷款类型:</text>
						<text class="info-value">{{ item.type }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">期限(年):</text>
						<text class="info-value">{{ item.term }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">额度:</text>
						<text class="info-value">{{ item.amount }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">还款方式:</text>
						<text class="info-value">{{ item.repaymentMethod }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">放款时间:</text>
						<text class="info-value">{{ item.disbursementDate }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">渠道:</text>
						<text class="info-value">{{ item.channel }}</text>
					</view>
					<view class="info-row">
						<text class="info-label">还款状态:</text>
						<view class="repayment-status" :class="'repayment-' + getRepaymentClass(item.repaymentStatus)">
							<text>{{ item.repaymentStatus }}</text>
						</view>
					</view>
					<view class="info-row" v-if="item.rejectReason">
						<text class="info-label">拒绝原因:</text>
						<text class="info-value reject-reason">{{ item.rejectReason }}</text>
					</view>
				</view>
				
				<view class="loan-actions">
					<view class="action-btn" @click="handleView(item)">
						<text class="btn-text">详情</text>
					</view>
					<view class="action-btn" @click="handleOverdue(item)">
						<text class="btn-text">逾期处理</text>
					</view>
					<view class="action-btn" @click="updateLoanStatus(item)">
						<text class="btn-text">更新进度</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				customerId: null,
				customerName: '',
				loanList: []
			}
		},
		onLoad(options) {
			if (options.id) {
				this.customerId = options.id;
				this.loadCustomerInfo();
				this.loadLoanList();
			}
		},
		methods: {
			// 加载客户信息
			loadCustomerInfo() {
				// 模拟获取客户信息
				// 实际项目中应该调用API获取
				if (this.customerId) {
					// 模拟数据
					this.customerName = '张三';
				}
			},
			
			// 加载贷款列表
			loadLoanList() {
				// 模拟加载贷款列表
				// 实际项目中应该调用API获取
				this.loanList = [
					{
						id: 1,
						name: '个人消费贷款',
						type: '消费贷',
						term: 3,
						repaymentMethod: '等额本息',
						disbursementDate: '2024-03-15',
						channel: '线上申请',
						status: '审批中',
						amount: '50,000元',
						repaymentStatus: '正常',
						rejectReason: ''
					},
					{
						id: 2,
						name: '小微企业贷款',
						type: '经营贷',
						term: 5,
						repaymentMethod: '先息后本',
						disbursementDate: '2024-02-20',
						channel: '网点申请',
						status: '已通过',
						amount: '200,000元',
						repaymentStatus: '已结清',
						rejectReason: ''
					},
					{
						id: 3,
						name: '住房装修贷款',
						type: '消费贷',
						term: 2,
						repaymentMethod: '等额本息',
						disbursementDate: '',
						channel: '线上申请',
						status: '已拒绝',
						amount: '100,000元',
						repaymentStatus: '未放款',
						rejectReason: '征信不符合要求'
					}
				];
			},
			
			// 获取状态样式类
			getStatusClass(status) {
				const statusMap = {
					'待审批': 'pending',
					'审批中': 'processing',
					'已通过': 'approved',
					'已拒绝': 'rejected'
				};
				return statusMap[status] || 'pending';
			},
			
			// 获取还款状态样式类
			getRepaymentClass(status) {
				const statusMap = {
					'正常': 'normal',
					'已结清': 'cleared',
					'逾期': 'overdue',
					'未放款': 'unpaid'
				};
				return statusMap[status] || 'normal';
			},
			
			// 处理创建贷款
			handleCreate() {
				// 跳转到贷款创建页面
				uni.navigateTo({
					url: '/pages/loan/create'
				});
			},
			
			// 查看贷款详情
			handleView(item) {
				uni.navigateTo({
					url: `/pages/loan/detail?id=${item.id}`
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