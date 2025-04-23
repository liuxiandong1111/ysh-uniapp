<template>
	<view class="loan-detail-container">
		<!-- 内容区域 -->
		<view class="content">
			<!-- 贷款信息部分 -->
			<view class="info-section">
				<view class="section-title">贷款信息</view>
				<view class="info-list">
					<view class="info-item">
						<text class="info-label">贷款名称</text>
						<text class="info-value">{{ loanDetail.name }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">贷款期限</text>
						<text class="info-value">{{ loanDetail.term }}年</text>
					</view>
					<view class="info-item">
						<text class="info-label">还款方式</text>
						<text class="info-value">{{ loanDetail.repaymentMethod }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">贷款额度</text>
						<text class="info-value">{{ loanDetail.amount || '-' }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">审批状态</text>
						<!-- <view class="status-tag" :class="getLoanStatusClass(loanDetail.status)"> -->
						<view class="status-tag">
							{{ getApprovalStatusText(loanDetail.status) }}
						</view>
					</view>
					<view class="info-item" v-if="loanDetail.status === 'approved'">
						<text class="info-label">放款时间</text>
						<text class="info-value">{{ loanDetail.disbursementDate }}</text>
					</view>
					<view class="info-item" v-if="loanDetail.status === 'rejected'">
						<text class="info-label">拒绝原因</text>
						<text class="info-value">{{ loanDetail.rejectReason }}</text>
					</view>
					<view class="info-item" v-if="loanDetail.status === 'approved'">
						<text class="info-label">还款状态</text>
						<!-- <view class="status-tag" :class="getRepaymentStatusClass(loanDetail.repaymentStatus)"> -->
						<view class="status-tag">
							{{ getRepaymentStatusText(loanDetail.repaymentStatus) }}
						</view>
					</view>
				</view>
			</view>
			
			<!-- 还款计划部分 -->
			<view class="info-section" v-if="loanDetail.status === 'approved'">
				<view class="section-title">还款计划</view>
				<view class="repayment-table">
					<view class="table-header">
						<view class="th">期数</view>
						<view class="th">到期日</view>
						<view class="th">应还金额</view>
						<view class="th">状态</view>
					</view>
					<view class="table-body">
						<view class="table-row" v-for="(item, index) in repaymentSchedule" :key="index">
							<view class="td">{{ item.period }}</view>
							<view class="td">{{ item.dueDate }}</view>
							<view class="td">{{ item.amount }}</view>
							<view class="td">
								<!-- <view class="status-tag" :class="getRepaymentStatusClass(item.status)"> -->
								<view class="status-tag">
									{{ getRepaymentStatusText(item.status) }}
								</view>
							</view>
						</view>
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
			loanId: '',
			loanDetail: {},
			repaymentSchedule: []
		}
	},
	onLoad(options) {
		if (options.id) {
			this.loanId = options.id;
			this.loadLoanDetail();
		}
	},
	methods: {
		loadLoanDetail() {
			// 模拟从API获取贷款详情数据
			setTimeout(() => {
				// 模拟数据
				this.loanDetail = {
					id: this.loanId,
					name: '个人消费贷',
					term: 3,
					repaymentMethod: '等额本息',
					amount: '10万',
					status: 'approved',
					disbursementDate: '2024-03-20',
					repaymentStatus: 'normal',
					rejectReason: '',
					type: '消费贷款',
					channel: '直销'
				};
				
				// 模拟还款计划数据
				this.repaymentSchedule = [
					{
						period: '1',
						dueDate: '2024-04-20',
						amount: '3,450元',
						status: 'completed'
					},
					{
						period: '2',
						dueDate: '2024-05-20',
						amount: '3,450元',
						status: 'normal'
					},
					{
						period: '3',
						dueDate: '2024-06-20',
						amount: '3,450元',
						status: 'normal'
					},
					{
						period: '4',
						dueDate: '2024-07-20',
						amount: '3,450元',
						status: 'normal'
					}
				];
				
				// 如果是拒绝状态，设置拒绝原因
				if (this.loanId === '3') {
					this.loanDetail.status = 'rejected';
					this.loanDetail.rejectReason = '征信不良';
				}
				
				// 如果是逾期状态
				if (this.loanId === '4') {
					this.loanDetail.repaymentStatus = 'overdue';
					this.repaymentSchedule[1].status = 'overdue';
				}
			}, 500);
			
			// 实际项目中使用API调用
			// uni.request({
			//   url: 'your_api_endpoint/loan/' + this.loanId,
			//   method: 'GET',
			//   success: (res) => {
			//     this.loanDetail = res.data;
			//   },
			//   fail: () => {
			//     uni.showToast({
			//       title: '获取贷款详情失败',
			//       icon: 'none'
			//     });
			//   }
			// });
			
			// 获取还款计划
			// uni.request({
			//   url: 'your_api_endpoint/loan/' + this.loanId + '/repayments',
			//   method: 'GET',
			//   success: (res) => {
			//     this.repaymentSchedule = res.data;
			//   }
			// });
		},
		getApprovalStatusText(status) {
			const map = {
				'pending': '待审批',
				'processing': '审批中',
				'approved': '已通过',
				'rejected': '已拒绝'
			};
			return map[status] || status;
		},
		getRepaymentStatusText(status) {
			const map = {
				'normal': '正常',
				'overdue': '逾期',
				'completed': '已结清',
				'delayed': '展期'
			};
			return map[status] || status;
		},
		getLoanStatusClass(status) {
			const map = {
				'pending': 'status-pending',
				'processing': 'status-processing',
				'approved': 'status-success',
				'rejected': 'status-danger'
			};
			return map[status] || '';
		},
		getRepaymentStatusClass(status) {
			const map = {
				'normal': 'status-success',
				'overdue': 'status-danger',
				'completed': 'status-info',
				'delayed': 'status-warning'
			};
			return map[status] || '';
		},
		goBack() {
			uni.navigateBack();
		}
	}
}
</script>

<style>
.loan-detail-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: #F5F7FA;
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

.content {
	flex: 1;
	padding: 30rpx;
	overflow-y: auto;
}

.info-section {
	background-color: #FFFFFF;
	border-radius: 10rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
}

.section-title {
	font-size: 32rpx;
	font-weight: 500;
	color: #303133;
	margin-bottom: 30rpx;
	border-left: 6rpx solid #409EFF;
	padding-left: 20rpx;
}

.info-list {
	display: flex;
	flex-direction: column;
}

.info-item {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
}

.info-item:last-child {
	border-bottom: none;
}

.info-label {
	color: #606266;
	flex: 1;
}

.info-value {
	color: #303133;
	flex: 2;
	text-align: right;
}

.status-tag {
	padding: 4rpx 16rpx;
	border-radius: 6rpx;
	font-size: 24rpx;
	color: #FFFFFF;
	text-align: center;
}

.status-success {
	background-color: #67C23A;
}

.status-danger {
	background-color: #F56C6C;
}

.status-warning {
	background-color: #E6A23C;
}

.status-info {
	background-color: #909399;
}

.status-pending {
	background-color: #909399;
}

.status-processing {
	background-color: #409EFF;
}

.repayment-table {
	width: 100%;
	border: 1rpx solid #EBEEF5;
	border-radius: 6rpx;
}

.table-header {
	display: flex;
	background-color: #F5F7FA;
	font-weight: 500;
}

.table-body {
	display: flex;
	flex-direction: column;
}

.table-row {
	display: flex;
	border-top: 1rpx solid #EBEEF5;
}

.th, .td {
	flex: 1;
	padding: 20rpx;
	text-align: center;
	font-size: 28rpx;
}

.th {
	color: #606266;
}

.td {
	color: #303133;
	display: flex;
	justify-content: center;
	align-items: center;
}

.footer {
	padding: 30rpx;
	background-color: #FFFFFF;
	border-top: 1rpx solid #EBEEF5;
}

.close-btn {
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	background-color: #FFFFFF;
	border: 1rpx solid #DCDFE6;
	color: #606266;
	font-size: 32rpx;
	border-radius: 8rpx;
}

.close-btn:active {
	background-color: #F2F6FC;
}
</style> 