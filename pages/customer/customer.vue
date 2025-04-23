<template>
	<view class="container">
		<view class="search-bar">
			<view class="search-bar-wrap">
				<view class="search-input-wrap">
					<view class="search-icon">
						<text class="iconfont">🔍</text>
					</view>
				<input class="search-input" type="text" @confirm="handleSearch" placeholder="搜索客户姓名或手机号"
					v-model="searchKey" />
			</view>
			<view class="search-btn" @click="handleSearch">搜索</view>
			<view class="filter-btn" @click="toggleFilterForm">
				<text>筛选</text>
				<text class="filter-icon">{{ showFilterForm ? '▲' : '▼' }}</text>
			</view>
			</view>

			<view class="filter-form" v-if="showFilterForm">
				<view class="form-row">
					<view class="form-group">
						<text class="form-label">手机号</text>
						<input class="form-select" type="text" v-model="phone" placeholder="请输入手机号"
							style="height: 30px;font-size: 14px;" />
					</view>
					<view class="form-group">
						<text class="form-label">所属部门</text>
						<picker :range="departmentOptions" @change="departmentChange" class="form-select">
							<view class="picker-value">{{ departmentOptions[currentDepartment] }}</view>
						</picker>
					</view>
				</view>

				<view class="form-row">
					<view class="form-group">
						<text class="form-label">客户状态</text>
						<picker :range="statusOptions" @change="statusChange" class="form-select">
							<view class="picker-value">{{ statusOptions[currentStatus] }}</view>
						</picker>
					</view>
					<view class="form-group">
						<text class="form-label">审批状态</text>
						<picker :range="approvalOptions" @change="approvalChange" class="form-select">
							<view class="picker-value">{{ approvalOptions[currentApproval] }}</view>
						</picker>
					</view>
				</view>
			</view>
		</view>

		<view class="main" :class="{ 'filter-shown': showFilterForm, 'filter-hidden': !showFilterForm }">
			<view class="customer-list">
				<view class="customer-item" v-for="(item, index) in customerList" :key="index">
					<view class="item-main">
						<view class="customer-info">
							<view class="name-status">
								<text class="name">{{ item.name }}</text>
								<text class="status" :class="'statusClass-' + item.status">{{ getStatusText(item.status)
									}}</text>
							</view>
							<view class="phone">
								<text class="label">手机号:</text>
								<text>{{ item.phone }}</text>
							</view>
							<view class="dept" v-if="item.department">
								<text class="label">所属部门:</text>
								<text>{{ item.department }}</text>
							</view>
							<view class="dept" v-if="item.status">
								<text class="label">客户状态:</text>
								<text>{{ item.status }}</text>
							</view>
							<view class="manager" v-if="item.manager">
								<text class="label">业务员:</text>
								<text>{{ item.manager }}</text>
							</view>
							<view class="manager">
								<text class="label">产品员:</text>
								<text>{{ item.productManager || '未分配' }}</text>
							</view>
							<view class="create-time">
								<text class="label">创建时间:</text>
								<text>{{ formatDate(item.createTime) }}</text>
							</view>
						</view>
						<view class="approval-status" v-if="item.jindu">
							<text class="status-box" :class="'jinduClass-' + item.jindu">{{ getJinduText(item.jindu)
								}}</text>
							<text class="amount" v-if="item.amount">¥{{ item.amount }}</text>
						</view>
					</view>
					<view class="item-actions">
						<view class="action-btn" @click="goDetail(item)">
							<text class="iconfont icon-detail"></text>
							<text>详情</text>
						</view>
						<view class="action-btn" @click="goEdit(item)">
							<text class="iconfont icon-edit"></text>
							<text>编辑</text>
						</view>
						<view class="action-btn" @click="goFollowup(item)">
							<text class="iconfont icon-comment"></text>
							<text>跟进记录</text>
						</view>
						<view class="action-btn" @click="updateStatus(item)">
							<text class="iconfont icon-status"></text>
							<text>更新状态</text>
						</view>
						<view class="action-btn" @click="transferCustomer(item)">
							<text class="iconfont icon-status"></text>
							<text>移交产品部</text>
						</view>
					</view>
				</view>

				<view class="empty-tip" v-if="customerList.length === 0">
					暂无客户数据
				</view>
			</view>

			<view class="add-fab" @click="goAdd">
				<text class="iconfont icon-add"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			searchKey: '',
			statusFilter: 'all',
			customerList: [],
			showFilterForm: false,
			departmentOptions: ['全部', '消费信贷部', '小微信贷部'],
			currentDepartment: 0,
			statusOptions: ['全部', '新客户', '意向客户', '已成交', '已流失'],
			currentStatus: 0,
			approvalOptions: ['全部', '待审批', '审批中', '已通过', '已拒绝'],
			currentApproval: 0,
			customerGroupOptions: ['全部', '消费', '经营'],
			currentCustomerGroup: 0,
			filterParams: {
				department: '',
				status: '',
				approvalStatus: '',
				customerGroup: ''
			}
		}
	},
	onLoad() {
		this.loadCustomerList();
	},
	methods: {
		loadCustomerList() {
			// 从API获取客户列表数据
			// 模拟筛选逻辑
			let filteredList = [];

			// 获取原始数据
			const rawData = [
				{
					id: 1,
					name: '张三',
					phone: '13800138000',
					manager: '王经理',
					department: '消费信贷部',
					product: '个人消费贷',
					loanStatus: '批款',
					amount: '10万',
					rejectReason: '',
					age: 35,
					marriageStatus: 'married',
					customerGroup: '消费',
					workplace: '北京科技有限公司',
					income: '20000元/月',
					jindu: 'pending',
					status: 'intention', // 意向客户
					creditDescription: '信用良好，无逾期',
					remarks: '客户对产品很感兴趣',
					createTime: '2024-03-14 10:25:36',
					updateTime: '2024-03-15 15:42:18'
				},
				{
					id: 2,
					name: '李四',
					phone: '13800138001',
					manager: '赵经理',
					department: '小微信贷部',
					product: '小微企业贷',
					loanStatus: '放款',
					amount: '20万',
					rejectReason: '',
					age: 42,
					marriageStatus: 'married',
					customerGroup: '经营',
					licenseInfo: '北京食品贸易有限公司',
					licenseImages: ['https://example.com/license1.jpg'],
					income: '50000元/月',
					creditDescription: '信用优良，历史贷款按时还款',
					jindu: 'approved',
					status: 'deal', // 已成交
					remarks: '老客户，已多次合作',
					createTime: '2024-03-10 09:15:22',
					updateTime: '2024-03-13 17:30:45'
				},
				{
					id: 3,
					name: '王五',
					phone: '13800138002',
					manager: '刘经理',
					department: '消费信贷部',
					product: '个人消费贷',
					loanStatus: '拒绝',
					amount: '',
					rejectReason: '征信不良',
					age: 28,
					marriageStatus: 'single',
					customerGroup: '消费',
					workplace: '上海贸易有限公司',
					income: '15000元/月',
					jindu: 'rejected',
					status: 'new', // 新客户
					creditDescription: '有多次信用卡逾期记录',
					remarks: '需要补充征信资料',
					createTime: '2024-03-12 14:20:33',
					updateTime: '2024-03-14 11:05:27'
				}
			];

			// 应用筛选条件
			filteredList = rawData.filter(item => {
				// 关键词搜索
				if (this.searchKey && !(item.name.includes(this.searchKey) || item.phone.includes(this.searchKey))) {
					return false;
				}

				// 部门筛选
				if (this.filterParams.department && item.department !== this.filterParams.department) {
					return false;
				}

				// 状态筛选
				if (this.filterParams.status) {
					let statusMap = {
						'新客户': 'new',
						'意向客户': 'intention',
						'已成交': 'deal',
						'已流失': 'lost'
					};
					if (item.status !== statusMap[this.filterParams.status]) {
						return false;
					}
				}

				// 审批状态筛选
				if (this.filterParams.approvalStatus) {
					let approvalMap = {
						'待审批': 'pending',
						'审批中': 'processing',
						'已通过': 'approved',
						'已拒绝': 'rejected'
					};
					if (item.jindu !== approvalMap[this.filterParams.approvalStatus]) {
						return false;
					}
				}

				// 客群筛选
				if (this.filterParams.customerGroup && item.customerGroup !== this.filterParams.customerGroup) {
					return false;
				}

				return true;
			});

			this.customerList = filteredList;

			// 实际项目中使用API调用代替
			// this.$api.customer.getList({
			//   keyword: this.searchKey,
			//   ...this.filterParams
			// }).then(res => {
			//   this.customerList = res.data || [];
			// }).catch(err => {
			//   uni.showToast({
			//     title: '获取客户列表失败',
			//     icon: 'none'
			//   });
			// });
		},
		handleSearch() {
			this.loadCustomerList();
		},
		changeStatusFilter(status) {
			this.statusFilter = status;
			this.loadCustomerList();
		},
		getStatusText(status) {
			const map = {
				'new': '电话联系',
				'intention': '未联系',
				'deal': '客户到访'
			};
			return map[status] || status;
		},
		getJinduText(jindu) {
			const map = {
				'pending': '待审批',
				'approved': '已通过',
				'rejected': '已拒绝'
			};
			return map[jindu] || jindu;
		},
		formatDate(timestamp) {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		},
		goDetail(item) {
			uni.navigateTo({
				url: `/pages/customer/detail?id=${item.id}`
			});
		},
		goEdit(item) {
			uni.navigateTo({
				url: `/pages/customer/add?id=${item.id}`
			});
		},
		goFollowup(item) {
			uni.navigateTo({
				url: `/pages/followup/followup?id=${item.id}`
			});
		},
		updateStatus(item) {
			uni.navigateTo({
				url: `/pages/customer/status?id=${item.id}`
			});
		},
		transferCustomer(item) {
			uni.navigateTo({
				url: `/pages/customer/transfer?id=${item.id}`
			});
		},
		createLoan(item) {
			uni.navigateTo({
				url: `/pages/loan/create?customerId=${item.id}`
			});
		},
		goAdd() {
			uni.navigateTo({
				url: `/pages/customer/add`
			});
		},
		toggleFilterForm() {
			this.showFilterForm = !this.showFilterForm;
		},
		departmentChange(e) {
			this.currentDepartment = e.detail.value;
			this.filterParams.department = this.currentDepartment === 0 ? '' : this.departmentOptions[this.currentDepartment];
		},
		statusChange(e) {
			this.currentStatus = e.detail.value;
			this.filterParams.status = this.currentStatus === 0 ? '' : this.statusOptions[this.currentStatus];
		},
		approvalChange(e) {
			this.currentApproval = e.detail.value;
			this.filterParams.approvalStatus = this.currentApproval === 0 ? '' : this.approvalOptions[this.currentApproval];
		},
		customerGroupChange(e) {
			this.currentCustomerGroup = e.detail.value;
			this.filterParams.customerGroup = this.currentCustomerGroup === 0 ? '' : this.customerGroupOptions[this.currentCustomerGroup];
		},
		resetFilters() {
			this.currentDepartment = 0;
			this.currentStatus = 0;
			this.currentApproval = 0;
			this.currentCustomerGroup = 0;
			this.filterParams = {
				department: '',
				status: '',
				approvalStatus: '',
				customerGroup: ''
			};
			uni.showToast({
				title: '筛选已重置',
				icon: 'none'
			});
		},
		applyFilters() {
			this.loadCustomerList();
			uni.showToast({
				title: '筛选条件已应用',
				icon: 'none'
			});
			this.showFilterForm = false;
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
	position: relative;
}

.main {
	flex: 1;
	padding: 15px;
}

/* 当筛选框显示时，为筛选框额外留出空间 */
.main.filter-shown {
	padding-top: 215px;
	/* 搜索框+筛选表单的高度 */
}

/* 当筛选框隐藏时，只为搜索框留出空间 */
.main.filter-hidden {
	padding-top: 70px;
	/* 只为搜索框留出空间 */
}

/* 搜索栏样式 */
.search-bar {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	z-index: 100;
	background-color: #fff;
	padding: 12px 15px;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-bar-wrap{
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

.filter-btn {
	background-color: #f5f7fa;
	color: #606266;
	border-radius: 20px;
	padding: 8px 15px;
	font-size: 14px;
	margin-left: 10px;
	display: flex;
	align-items: center;
}

.filter-icon {
	margin-left: 5px;
	font-size: 12px;
}

/* 筛选表单样式 */
.filter-form {
	background-color: #fff;
	padding: 15px;
	margin-top: 10px;
}

.form-row {
	display: flex;
	margin-bottom: 15px;
}

.form-group {
	flex: 1;
	margin-right: 10px;
}

.form-group:last-child {
	margin-right: 0;
}

.form-label {
	display: block;
	font-size: 14px;
	color: #333;
	margin-bottom: 5px;
}

.form-select {
	width: 100%;
	border: 1px solid #eee;
	border-radius: 4px;
	background-color: #f8f8f8;
}

.picker-value {
	font-size: 14px;
	color: #333;
	padding: 5px 0;
}

.form-buttons {
	display: flex;
	justify-content: flex-end;
	margin-top: 15px;
}

.filter-btn-reset {
	background-color: #f5f7fa;
	color: #606266;
	border: 1px solid #dcdfe6;
	border-radius: 4px;
	padding: 8px 20px;
	font-size: 14px;
	margin-right: 10px;
}

.filter-btn-apply {
	background-color: #409EFF;
	color: white;
	border: none;
	border-radius: 4px;
	padding: 8px 20px;
	font-size: 14px;
}

/* 客户列表样式 */
.customer-list {
	margin-top: 15px;
	margin-bottom: 15px;
}

.customer-item {
	background-color: #fff;
	border-radius: 8px;
	padding: 15px;
	margin-bottom: 10px;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.item-main {
	display: flex;
	justify-content: space-between;
	margin-bottom: 10px;
}

.customer-info {
	flex: 1;
}

.name-status {
	display: flex;
	align-items: center;
	margin-bottom: 8px;
}

.name {
	font-size: 16px;
	font-weight: bold;
	margin-right: 10px;
}

.status {
	font-size: 12px;
	padding: 2px 8px;
	border-radius: 10px;
	color: white;
}

.statusClass-new {
	background-color: #5ac8fa;
}

.statusClass-intention {
	background-color: #ff9500;
}

.statusClass-deal {
	background-color: #4cd964;
}

.statusClass-lost {
	background-color: #8e8e93;
}

.phone,
.dept,
.manager,
.create-time {
	font-size: 14px;
	color: #666;
	margin-bottom: 5px;
	display: flex;
}

.label {
	color: #999;
	margin-right: 5px;
	min-width: 70px;
}

.approval-status {
	display: flex;
	flex-direction: column;
	align-items: flex-end;
	justify-content: flex-start;
}

.status-box {
	padding: 3px 8px;
	font-size: 12px;
	border-radius: 4px;
	color: white;
	margin-bottom: 5px;
}

.jinduClass-pending {
	background-color: #ff9500;
}

.jinduClass-approved {
	background-color: #4cd964;
}

.jinduClass-rejected {
	background-color: #ff3b30;
}

.amount {
	font-size: 16px;
	font-weight: bold;
	color: #ff3b30;
}

.item-actions {
	display: flex;
	flex-wrap: wrap;
	border-top: 1px solid #eee;
	padding-top: 10px;
}

.action-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right: 15px;
	margin-bottom: 5px;
}

.action-btn .iconfont {
	font-size: 20px;
	color: #007AFF;
	margin-bottom: 3px;
}

.action-btn text:last-child {
	font-size: 12px;
	color: #666;
}

.empty-tip {
	text-align: center;
	padding: 15px;
	color: #909399;
}

.add-fab {
	position: fixed;
	right: 15px;
	bottom: 15px;
	width: 50px;
	height: 50px;
	border-radius: 50%;
	background-color: #007AFF;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}

.add-fab .iconfont {
	font-size: 24px;
	color: white;
}

/* 图标样式 */
.icon-add:before {
	content: "\e6da";
}

.icon-back:before {
	content: "\e6db";
}

.icon-search:before {
	content: "\e6dc";
}

.icon-filter:before {
	content: "\e6dd";
}
</style>