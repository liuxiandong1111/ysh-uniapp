<template>
	<view class="container">
		<view class="main">
			<view class="search-bar">
				<view class="search-input-wrap">
					<view class="search-icon">
						<text class="iconfont">🔍</text>
					</view>
					<input class="search-input" type="text" v-model="searchKey" placeholder="搜索客户姓名或手机号" />
				</view>
				<view class="search-btn" @click="searchCustomers">搜索</view>
			</view>

			<view class="customer-list">
				<view class="customer-card" v-for="(item, index) in pendingCustomerList" :key="index">
					<view class="customer-info">
						<view class="customer-header">
							<text class="customer-name">{{ item.name }}</text>
							<text class="customer-status" :class="'status-' + getStatusClass(item.status)">{{ item.status
								|| '待审批'}}</text>
						</view>
						<view class="info-row">
							<text class="info-label">手机号:</text>
							<text class="info-value">{{ item.phone }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">所属客群:</text>
							<text class="info-value">{{ item.customerGroup }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">业务员:</text>
							<text class="info-value">{{ item.manager }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">产品员:</text>
							<text class="info-value">{{ item.assignedBy || '未分配' }}</text>
						</view>
					</view>
					<view class="customer-actions">
						<view class="action-btn view-btn" @click="handleViewCustomer(item)">
							<text class="btn-text">查看客户</text>
						</view>
						<view class="action-btn loan-btn" @click="handleCreateLoan(item)">
							<text class="btn-text">申请贷款</text>
						</view>
					</view>
				</view>

				<view class="empty-tip" v-if="pendingCustomerList.length === 0">
					暂无待处理客户数据
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 0,
			searchKey: '',
			customerForm: {
				name: '',
				phone: '',
				idCard: '',
				age: '',
				marriage: null
			},
			loanForm: {
				product: null,
				amount: '',
				term: null,
				purpose: null,
				monthlyIncome: ''
			},
			marriageOptions: ['未婚', '已婚', '离异', '丧偶'],
			loanProducts: ['个人消费贷', '经营贷', '房屋抵押贷', '汽车抵押贷', '信用贷'],
			loanTerms: ['3个月', '6个月', '12个月', '24个月', '36个月', '48个月', '60个月'],
			loanPurposes: ['消费', '经营', '装修', '教育', '医疗', '旅游', '其他'],
			uploadList: [
				{
					label: '身份证正面',
					path: ''
				},
				{
					label: '身份证反面',
					path: ''
				},
				{
					label: '工作证明',
					path: ''
				},
				{
					label: '收入证明',
					path: ''
				}
			],
			pendingCustomerList: []
		}
	},
	onLoad(option) {
		// 如果从客户页面跳转过来，会带上客户名称
		if (option.customer) {
			this.customerForm.name = option.customer;
		}

		// 加载待处理客户列表
		this.loadPendingCustomers();
	},
	methods: {
		// 切换标签
		switchTab(index) {
			this.activeTab = index;
			if (index === 1) {
				this.loadPendingCustomers();
			}
		},

		// 加载待处理客户列表
		loadPendingCustomers() {
			// 模拟从服务器获取数据
			this.pendingCustomerList = [
				{
					id: 1,
					name: '张三',
					phone: '13800138000',
					manager: '王经理',
					customerGroup: '消费',
					status: '待审批',
					assignedBy: '李产品'
				},
				{
					id: 2,
					name: '李四',
					phone: '13800138001',
					manager: '赵经理',
					customerGroup: '经营',
					status: '审批中',
					assignedBy: '王产品'
				},
				{
					id: 3,
					name: '王五',
					phone: '13800138002',
					manager: '刘经理',
					customerGroup: '消费',
					status: '已拒绝',
					assignedBy: '张产品'
				}
			];

			// 应用搜索过滤
			if (this.searchKey) {
				this.pendingCustomerList = this.pendingCustomerList.filter(item =>
					item.name.includes(this.searchKey) ||
					item.phone.includes(this.searchKey)
				);
			}
		},

		// 搜索客户
		searchCustomers() {
			this.loadPendingCustomers();
		},

		// 获取状态样式类
		getStatusClass(status) {
			if (!status) return 'pending';

			const statusMap = {
				'待审批': 'pending',
				'审批中': 'processing',
				'已通过': 'approved',
				'已拒绝': 'rejected'
			};

			return statusMap[status] || 'pending';
		},

		// 查看客户详情
		handleViewCustomer(item) {
			uni.navigateTo({
				url: `/pages/customer/detail?id=${item.id}&type=loan`
			});
		},

		// 为客户创建贷款
		handleCreateLoan(item) {
			// 跳转到贷款申请页面，并传递客户ID
			uni.navigateTo({
				url: `/pages/loan/apply?id=${item.id}`
			});
		},

		marriageChange(e) {
			this.customerForm.marriage = e.detail.value;
		},
		productChange(e) {
			this.loanForm.product = e.detail.value;
		},
		termChange(e) {
			this.loanForm.term = e.detail.value;
		},
		purposeChange(e) {
			this.loanForm.purpose = e.detail.value;
		},
		chooseImage(index) {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					this.uploadList[index].path = res.tempFilePaths[0];
				}
			});
		},
		resetForm() {
			this.customerForm = {
				name: '',
				phone: '',
				idCard: '',
				age: '',
				marriage: null
			};
			this.loanForm = {
				product: null,
				amount: '',
				term: null,
				purpose: null,
				monthlyIncome: ''
			};
			this.uploadList.forEach(item => {
				item.path = '';
			});
		},
		validateForm() {
			// 表单验证逻辑
			if (!this.customerForm.name) {
				uni.showToast({
					title: '请输入客户姓名',
					icon: 'none'
				});
				return false;
			}
			if (!this.customerForm.phone) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				});
				return false;
			}
			if (!this.loanForm.amount) {
				uni.showToast({
					title: '请输入贷款金额',
					icon: 'none'
				});
				return false;
			}
			if (this.loanForm.product === null) {
				uni.showToast({
					title: '请选择贷款产品',
					icon: 'none'
				});
				return false;
			}
			return true;
		},
		submitLoan() {
			if (this.validateForm()) {
				uni.showLoading({
					title: '提交中...'
				});

				// 模拟提交
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: '提交成功',
						icon: 'success'
					});

					// 提交成功后返回
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/dashboard/dashboard'
						});
					}, 1500);
				}, 2000);
			}
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

.main {
	flex: 1;
	padding: 15px;
}

.tabs {
	display: flex;
	margin-bottom: 15px;
	border-bottom: 1px solid #ebeef5;
	background-color: #fff;
	border-radius: 8px 8px 0 0;
}

.tab {
	padding: 12px 15px;
	font-size: 14px;
	color: #606266;
	position: relative;
	flex: 1;
	text-align: center;
}

.tab.active {
	color: #409EFF;
}

.tab.active:after {
	content: '';
	position: absolute;
	bottom: -1px;
	left: 0;
	right: 0;
	height: 2px;
	background-color: #409EFF;
}

.card {
	background-color: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	margin-bottom: 20px;
	padding: 15px;
}

.card-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 15px;
	color: #303133;
	display: flex;
	align-items: center;
}

.card-title::before {
	content: '';
	width: 4px;
	height: 16px;
	background-color: #409EFF;
	margin-right: 8px;
	border-radius: 2px;
}

.form-group {
	margin-bottom: 15px;
}

.form-label {
	display: block;
	margin-bottom: 5px;
	font-weight: 500;
	font-size: 14px;
}

.form-control {
	width: 100%;
	padding: 10px;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	font-size: 14px;
	background-color: #fff;
}

.placeholder {
	color: #999;
}

.upload-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 15px;
}

.upload-label {
	font-size: 14px;
	margin-bottom: 5px;
}

.upload-container {
	height: 100px;
	border: 1px dashed #dcdfe6;
	border-radius: 4px;
	overflow: hidden;
}

.upload-image {
	width: 100%;
	height: 100%;
}

.upload-placeholder {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #f5f7fa;
}

.upload-icon {
	font-size: 24px;
	color: #909399;
	margin-bottom: 5px;
}

.upload-text {
	font-size: 12px;
	color: #909399;
}

.form-actions {
	display: flex;
	justify-content: space-between;
	margin-top: 20px;
	margin-bottom: 30px;
}

.btn {
	flex: 1;
	padding: 12px 0;
	border-radius: 4px;
	font-size: 14px;
	text-align: center;
	border: none;
}

.btn-default {
	background-color: #f5f7fa;
	border: 1px solid #dcdfe6;
	color: #606266;
	margin-right: 15px;
}

.btn-primary {
	background-color: #409EFF;
	color: white;
}

/* 待处理客户列表样式 */
.search-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background-color: #fff;
	padding: 12px 15px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	display: flex;
	align-items: center;
}

.search-input-wrap {
	flex: 1;
	display: flex;
	align-items: center;
	background-color: #f5f7fa;
	border-radius: 20px;
	padding: 0 10px;
	height: 36px;
}

.search-icon {
	color: #909399;
	margin-right: 5px;
}

.search-input {
	flex: 1;
	height: 36px;
	border: none;
	background-color: transparent;
	font-size: 14px;
}

.search-btn {
	background-color: #409EFF;
	color: white;
	border-radius: 20px;
	padding: 8px 15px;
	font-size: 14px;
	margin-left: 10px;
}

.customer-list {
	margin-top: 70px; /* 为固定搜索框留出空间 */
	margin-bottom: 20px;
}

.customer-card {
	background-color: #fff;
	border-radius: 8px;
	margin-bottom: 15px;
	padding: 15px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.customer-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 10px;
}

.customer-name {
	font-size: 16px;
	font-weight: bold;
	color: #303133;
}

.customer-status {
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

.info-row {
	display: flex;
	margin-bottom: 8px;
	font-size: 14px;
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

.customer-actions {
	display: flex;
	border-top: 1px solid #ebeef5;
	padding-top: 12px;
	margin-top: 12px;
}

.action-btn {
	flex: 1;
	text-align: center;
}

.btn-text {
	font-size: 14px;
}

.view-btn {
	color: #409EFF;
}

.loan-btn {
	color: #67c23a;
}

.empty-tip {
	text-align: center;
	color: #909399;
	padding: 20px;
	background-color: #fff;
	border-radius: 8px;
}
</style>