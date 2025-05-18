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
						<text class="info-label">贷款类型</text>
						<text class="info-value">{{ loanDetail.type == 1 ? '消费' : loanDetail.type == 2 ? '经营' : loanDetail.type == 3 ? '消费经营' : '' }}</text>
					</view>
          <view class="info-item">
            <text class="info-label">贷款期限</text>
            <text class="info-value">{{ loanDetail.age_limit }}年</text>
          </view>
					<view class="info-item">
						<text class="info-label">还款方式</text>
						<text class="info-value">{{ getDueType(loanDetail.due_type) }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">贷款额度</text>
						<text class="info-value">{{ loanDetail.quota || '-' }}</text>
					</view>
					<view class="info-item" v-if="loanDetail.status == '2'">
						<text class="info-label">贷款状态</text>
						<!-- <view class="status-tag" :class="getLoanStatusClass(loanDetail.status)"> -->
						<view class="info-value">
							{{ getApprovalStatusText(loanDetail.status) }}
						</view>
					</view>
					<view class="info-item" v-if="loanDetail.status == '2'">
						<text class="info-label">放款时间</text>
						<text class="info-value">{{ loanDetail.loan_date }}</text>
					</view>
					<view class="info-item" v-if="loanDetail.status == '3'">
						<text class="info-label">拒绝原因</text>
						<text class="info-value">{{ loanDetail.cause }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">还款状态</text>
						<view class="info-value">
							{{  loanDetail.is_yu == 0 ? '正常' : '逾期' }}
						</view>
					</view>
          <view class="info-item" v-if="loanDetail.is_yu == 1 && loanDetail.yu_desc">
            <text class="info-label">逾期说明</text>
            <text class="info-value">{{ loanDetail.yu_desc }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">渠道</text>
            <text class="info-value">{{ loanDetail.channel }}</text>
          </view>
          <view class="info-item">
            <text class="info-label">创建时间</text>
            <text class="info-value">{{ loanDetail.ctime }}</text>
          </view>
				</view>
			</view>
			
			<!-- 还款计划部分 -->
			<view class="info-section" v-if="loanDetail.status == '2'">
				<view class="section-title">还款计划</view>
				<view class="repayment-table">
					<view class="table-header">
						<view class="th" style="flex: 1">期数</view>
						<view class="th" style="flex: 2">到期日</view>
						<view class="th" style="flex: 2">应还金额</view>
						<view class="th" style="flex: 1">状态</view>
					</view>
					<view class="table-body">
						<view class="table-row" v-for="(item, index) in repaymentSchedule" :key="index">
							<view class="td" style="flex: 1">{{ index + 1 }}</view>
							<view class="td" style="flex: 2">{{ item.due_date }}</view>
							<view class="td" style="flex: 2">{{ item.money }}</view>
							<view class="td" style="flex: 1">
								<!-- <view class="status-tag" :class="getRepaymentStatusClass(item.status)"> -->
								<view>
									{{  item.status == 3 ? '待还' : item.status == 1 ? '正常' : item.status == 2 ? '逾期' : '' }}
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
import { approvalStatus } from '@/utils/dict.js';
import financeApi from '@/api/finance.js';
export default {
	data() {
		return {
			loanId: '',
			loanDetail: {},
			repaymentSchedule: [],
      approvalStatus
		}
	},
	onLoad(options) {
		if (options.id) {
			this.loanId = options.id;
			this.loanDetail = JSON.parse(decodeURIComponent(options.loanData))
			console.log(this.loanDetail, 'this.loanDetail')
			if (this.loanDetail.status == '2') {
				this.loadLoanDetail();
			} else {
				this.repaymentSchedule = []
			}
		}
	},
	methods: {
		loadLoanDetail() {
      this.repaymentSchedule  = []
      financeApi.getRepaymentSchedule({ id: this.loanId }).then(res => {
        if (res.retCode == 200) {
          this.repaymentSchedule = res.data
        } else {
          uni.showToast({
            title: res.message,
            icon: 'none',
            duration: 1500
          });
        }
      })
		},
    getApprovalStatusText(status) {
			return this.approvalStatus.find(item => item.value === status)?.label || '';
		},
    getDueType(type) {
      switch (Number(type)) {
        case 1: return '等额本息'
        case 2: return '先息后本'
        case 3: return '随借随还'
        default: return '未知'
      }
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