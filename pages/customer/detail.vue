<template>
	<view class="container">

		<view class="tabs" v-if="type !== 'loan'">
			<view v-for="(tab, index) in detailTabs" :key="index"
				:class="['tab-item', { active: activeTab === tab.key }]" @click="activeTab = tab.key">
				{{ tab.name }}
			</view>
		</view>

		<view class="content" :style="{ paddingTop: type === 'loan' ? '15px' : '55px' }">
			<!-- 基本信息 TAB -->
			<view class="tab-content" v-if="activeTab === 'basic'">
				<view class="info-section">
					<view class="section-title">基本信息</view>
					<view class="info-list">
						<view class="info-item">
							<text class="info-label">姓名</text>
							<text class="info-value">{{ customerInfo.name }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">手机号</text>
							<text class="info-value">{{ customerInfo.phone }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">年龄</text>
							<text class="info-value">{{ customerInfo.age }}</text>
						</view>
						<view class="info-item">
							<text class="info-label">婚姻状态</text>
							<text class="info-value">{{ getMarriageStatusText(customerInfo.marriageStatus) }}</text>
						</view>
					</view>
				</view>

				<view class="info-section">
					<view class="section-title">客户资料</view>
					<view class="info-list">
						<view class="info-item">
							<text class="info-label">所属客群</text>
							<text class="info-value">{{ customerInfo.customerGroup }}</text>
						</view>
						<view class="info-item full-width">
							<text class="info-label">工作单位</text>
							<text class="info-value">{{ customerInfo.workplace }}</text>
						</view>

						<view class="info-item full-width" v-if="customerInfo.license_info">
							<text class="info-label">执照信息</text>
							<text class="info-value">{{ customerInfo.license_info }}</text>
						</view>

						<view class="info-item full-width" v-if="customerInfo.license_img">
							<text class="info-label">执照图片</text>
							<view class="image-container">
								<image v-for="(img, imgIndex) in licenseImgList" :key="imgIndex" :src="img"
									class="license-image" @click="previewImage(img)" />
							</view>
						</view>

						<view class="info-item full-width">
							<text class="info-label">资产状况</text>
							<text class="info-value">{{ customerInfo.asset_info || '未填写' }}</text>
						</view>

						<view class="info-item full-width">
							<text class="info-label">收入描述</text>
							<text class="info-value">{{ customerInfo.income }}</text>
						</view>

						<view class="info-item full-width">
							<text class="info-label">征信描述</text>
							<text class="info-value">{{ customerInfo.credit_investigation }}</text>
						</view>

						<view class="info-item full-width">
							<text class="info-label">备注信息</text>
							<text class="info-value">{{ customerInfo.descr }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 贷款信息 TAB -->
			<view class="tab-content" v-else-if="activeTab === 'followUp'">
				<view v-if="loanList.length === 0" class="empty-tip">暂无贷款记录</view>
				<view v-else class="loan-list">
					<view v-for="(loan, loanIndex) in loanList" :key="loanIndex" class="loan-item">
						<view class="loan-header">
							<text class="loan-name">{{ loan.name }}</text>
							<text class="loan-status" :class="'status-' + loan.status">{{
								getApprovalStatusText(loan.status) }}</text>
						</view>
						<view class="loan-info">
							<view class="loan-info-item">
								<text class="loan-info-label">贷款类型:</text>
								<text class="loan-info-value">{{ loan.type == 1 ? '消费' : '经营' }}</text>
							</view>
							<view class="loan-info-item">
								<text class="loan-info-label">期限(年):</text>
								<text class="loan-info-value">{{ loan.age_limit }}</text>
							</view>
							<view class="loan-info-item">
								<text class="loan-info-label">还款方式:</text>
								<text class="loan-info-value">{{ loan.due_type == 1 ? '等额本息' : loan.due_type == 2 ?
									'先息后本' : loan.due_type == 3 ? '随借随还' : '' }}</text>
							</view>
							<view class="loan-info-item">
								<text class="loan-info-label">放款时间:</text>
								<text class="loan-info-value">{{ loan.loan_date || '' }}</text>
							</view>
							<view class="loan-info-item">
								<text class="loan-info-label">额度:</text>
								<text class="loan-info-value">{{ loan.quota }}</text>
							</view>
							<view class="loan-info-item" v-if="loan.status == 2">
								<text class="loan-info-label">还款状态:</text>
								<text class="loan-info-value" :class="'repay-' + loan.is_yu">{{
									getRepaymentStatusText(loan.is_yu) }}</text>
							</view>
							<view class="loan-info-item" v-if="loan.rejectReason">
								<text class="loan-info-label">拒绝原因:</text>
								<text class="loan-info-value">{{ loan.rejectReason }}</text>
							</view>
						</view>
						<view class="loan-action">
							<button @click="viewLoanDetail(loan)" class="loan-detail-btn">详情</button>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { maritalStatus, approvalStatus } from '@/utils/dict.js';
import financeApi from '@/api/finance.js';
export default {
	data() {
		return {
			customerId: '',
			activeTab: 'basic',
			detailTabs: [
				{ name: '基本信息', key: 'basic' },
				{ name: '贷款信息', key: 'followUp' }
			],
			customerInfo: {},
			loanList: [],
			type: '',
			pageType: '',
			approvalStatus
		}
	},
	onLoad(options) {
		if (options.id) {
			this.customerId = options.id;
			this.type = options.type || '';

			// 解析从列表页传递过来的客户数据
			if (options.customerData) {
				try {
					const customerData = JSON.parse(decodeURIComponent(options.customerData));
					this.customerInfo = {
						id: customerData.id,
						name: customerData.name || '未知',
						phone: customerData.phone || '未填写',
						age: customerData.age || '',
						marriageStatus: customerData.matrimony || '', // 婚姻状态
						manager: customerData.service_name || '未分配', // 业务员
						department: customerData.branch_name || '未分配', // 所属部门
						customerGroup: this.getClientType(customerData.client_type),
						workplace: customerData.work_unit || '',
						license_info: customerData.license_info || '',
						license_img: customerData.license_img || '',
						asset_info: customerData.asset_info || '',
						income: customerData.income || '未填写',
						credit_investigation: customerData.credit_investigation || '未填写',
						descr: customerData.descr || '',
						createTime: this.formatDate(customerData.ctime),
						updateTime: this.formatDate(customerData.utime)
					};

					if (customerData.deal_status != 1) {
						this.loadLoanList();
					} else {
						this.loanList = [];
					}
				} catch (e) {
					console.error('解析客户数据失败', e);
					// 解析失败时调用API获取详情
				}
			} else {

			}
		}
	},
	methods: {
		getMarriageStatusText(status) {
			console.log('status', maritalStatus, status);
			return maritalStatus.find(item => item.value == status)?.label || '';
		},
		getApprovalStatusText(status) {
			const map = {
				'1': '开户中',
				'2': '批款',
				'3': '拒绝'
			};
			return map[status] || status;
		},
		getRepaymentStatusText(status) {
			const map = {
				'0': '正常',
				'1': '逾期'
			};
			return map[status] || status;
		},
		previewImage(img) {
			uni.previewImage({
				urls: this.licenseImgList,
				current: img
			});
		},
		viewLoanDetail(loan) {
			const loanData = encodeURIComponent(JSON.stringify(loan));
			uni.navigateTo({
				url: `/pages/loan/detail?id=${loan.id}&loanData=${loanData}`
			});
		},
		goBack() {
			uni.navigateBack();
		},
		editCustomer() {
			uni.navigateTo({
				url: `/pages/customer/edit?id=${this.customerId}`
			});
		},
		getClientType(type) {
			const map = {
				'1': '消费',
				'2': '经营',
				'3': '消费经营'
			};
			return map[type] || '未知类型';
		},
		formatDate(timestamp) {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
		},
		async loadLoanList() {
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
					// 转换API返回数据为页面需要的格式
					this.loanList = res.data.list || []

					if (this.loanList.length === 0) {
						console.log('暂无贷款记录');
					}
				} else {
					console.error('获取贷款列表失败:', res.retMsg || '未知错误');
				}
			} catch (error) {
				// 隐藏加载提示
				uni.hideLoading();
				console.error('获取贷款列表失败:', error);
			}
		},

		// 获取还款方式文本
		getDueTypeText(type) {
			switch (Number(type)) {
				case 1: return '等额本息';
				case 2: return '先息后本';
				case 3: return '随借随还';
				default: return '未知';
			}
		},

		// 获取状态类名
		getStatusClass(status) {
			const statusMap = {
				'1': 'pending',
				'2': 'approved',
				'3': 'rejected'
			};
			return statusMap[status] || 'pending';
		}
	},
	computed: {
		licenseImgList() {
			// 如果license_img是字符串，则按逗号分隔；如果已经是数组，则直接返回
			if (typeof this.customerInfo.license_img === 'string' && this.customerInfo.license_img) {
				console.log('处理执照图片字符串:', this.customerInfo.license_img);
				return this.customerInfo.license_img.split(',').filter(img => img);
			} else if (Array.isArray(this.customerInfo.license_img)) {
				console.log('执照图片已是数组:', this.customerInfo.license_img);
				return this.customerInfo.license_img;
			}
			console.log('没有执照图片');
			return [];
		}
	}
}
</script>

<style>
.container {
	display: flex;
	flex-direction: column;
	background-color: #f5f7fa;
	position: relative;
	height: 100vh;
}

.tabs {
	display: flex;
	background-color: #fff;
	border-bottom: 1px solid #eee;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 1000;
}

.tab-item {
	flex: 1;
	height: 44px;
	line-height: 44px;
	text-align: center;
	font-size: 14px;
	color: #333;
	position: relative;
}

.tab-item.active {
	color: #409EFF;
	font-weight: bold;
}

.tab-item.active:after {
	content: '';
	position: absolute;
	bottom: 0;
	left: 50%;
	transform: translateX(-50%);
	width: 40px;
	height: 2px;
	background-color: #409EFF;
}

.content {
	padding: 55px 15px 0;
	box-sizing: border-box;
}

.tab-content {}

.info-section {
	background-color: #fff;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 15px;
}

.section-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 15px;
	color: #333;
	border-left: 3px solid #409EFF;
	padding-left: 10px;
}

.info-list {
	display: flex;
	flex-wrap: wrap;
}

.info-item {
	width: 50%;
	margin-bottom: 15px;
}

.info-item.full-width {
	width: 100%;
}

.info-label {
	display: block;
	font-size: 14px;
	color: #999;
	margin-bottom: 5px;
}

.info-value {
	font-size: 14px;
	color: #333;
	word-break: break-all;
}

.image-container {
	display: flex;
	flex-wrap: wrap;
	margin-top: 5px;
}

.license-image {
	width: 80px;
	height: 80px;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 4px;
	background-color: #f5f5f5;
}

.empty-tip {
	text-align: center;
	padding: 30px 0;
	color: #999;
	font-size: 14px;
}

.loan-list {}

.loan-item {
	background-color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
	padding: 15px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.loan-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid #f5f5f5;
}

.loan-name {
	font-size: 16px;
	font-weight: bold;
	color: #333;
}

.loan-status {
	font-size: 12px;
	padding: 2px 8px;
	border-radius: 10px;
	color: white;
}

.status-1 {
	background-color: #909399;
}

.status-processing {
	background-color: #E6A23C;
}

.status-2 {
	background-color: #67C23A;
}

.status-3 {
	background-color: #F56C6C;
}

.loan-info {
	display: flex;
	flex-wrap: wrap;
}

.loan-info-item {
	width: 100%;
	margin-bottom: 10px;
}

.loan-info-label {
	color: #999;
	font-size: 14px;
	margin-right: 5px;
}

.loan-info-value {
	color: #333;
	font-size: 14px;
}

.repay-normal {
	color: #67C23A;
}

.repay-overdue {
	color: #F56C6C;
}

.repay-completed {
	color: #909399;
}

.repay-delayed {
	color: #E6A23C;
}

.loan-action {
	margin-top: 10px;
	text-align: right;
}

.loan-detail-btn {
	display: inline-block;
	background-color: #409EFF;
	color: white;
	font-size: 14px;
	border-radius: 4px;
	border: none;
}

.footer {
	padding: 10px 15px;
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	border-top: 1px solid #eee;
}

.btn {
	flex: 1;
	height: 40px;
	line-height: 40px;
	text-align: center;
	border-radius: 4px;
	font-size: 16px;
}

.btn-default {
	background-color: #f5f5f5;
	color: #333;
	margin-right: 10px;
}

.btn-primary {
	background-color: #409EFF;
	color: white;
}
</style>