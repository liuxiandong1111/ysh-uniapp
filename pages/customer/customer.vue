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
								<text class="name">{{ item.name || '未知' }}</text>
								<text class="status" :class="'statusClass-' + (item.status || 1)">{{ dictMaps.customerStatus[item.status] || '未知状态' }}</text>
							</view>
							<view class="phone">
								<text class="label">手机号:</text>
								<text>{{ item.phone || '未填写' }}</text>
							</view>
							<view class="dept">
								<text class="label">所属部门:</text>
								<text>{{ item.branch_name || '未分配' }}</text>
							</view>
							<view class="dept">
								<text class="label">客户类型:</text>
								<text>{{ dictMaps.customerType[item.client_type] || '未知类型' }}</text>
							</view>
							<view class="manager">
								<text class="label">业务员:</text>
								<text>{{ item.service_name || '未分配' }}</text>
							</view>
							<view class="manager" v-if="item.product_name">
								<text class="label">产品员:</text>
								<text>{{ item.product_name }}</text>
							</view>
							<view class="create-time">
								<text class="label">创建时间:</text>
								<text>{{ formatDate(item.ctime) }}</text>
							</view>
						</view>
						<view class="approval-status">
							<text class="status-box" :class="'dealClass-' + (item.deal_status || 1)">
								{{ dictMaps.dealStatus[item.deal_status] || '未知状态' }}
							</text>
							<text class="client-age" v-if="item.age">{{ item.age }}岁</text>
							<text class="marital-status" v-if="item.matrimony">{{ dictMaps.maritalStatus[item.matrimony] }}</text>
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
				
				<!-- 分页控件 -->
				<view class="pagination" v-if="totalCount > 0">
					<view class="pagination-info">
						共 {{ totalCount }} 条数据，当前页 {{ page }}/{{ Math.ceil(totalCount / pageSize) }}
					</view>
					<view class="pagination-btn-group">
						<view class="pagination-btn" :class="{ disabled: page <= 1 }" @click="prevPage">
							上一页
						</view>
						<view class="pagination-btn" :class="{ disabled: page >= Math.ceil(totalCount / pageSize) }" @click="nextPage">
							下一页
						</view>
					</view>
				</view>
			</view>

			<view class="add-fab" @click="goAdd">
				<text class="iconfont icon-add"></text>
			</view>
		</view>
	</view>
</template>

<script>
import customerApi from '@/api/customer.js';
import { dictMaps, getLabelByValue, customerType, customerStatus, dealStatus } from '@/utils/dict.js';

export default {
	data() {
		return {
			searchKey: '',
			phone: '',
			statusFilter: 'all',
			customerList: [],
			showFilterForm: false,
			departmentOptions: ['全部', '消费信贷部', '小微信贷部'],
			currentDepartment: 0,
			statusOptions: ['全部', '未联系', '电话联系', '客户到访', '提交材料', '完成'],
			currentStatus: 0,
			approvalOptions: ['全部', '未审批', '审批中', '已通过', '已拒绝'],
			currentApproval: 0,
			customerGroupOptions: ['全部', '消费', '经营', '消费经营'],
			currentCustomerGroup: 0,
			filterParams: {
				department: '',
				status: '',
				approvalStatus: '',
				customerGroup: ''
			},
			page: 1,
			pageSize: 20,
			totalCount: 0,
			dictMaps: dictMaps
		}
	},
	onLoad() {
		// 检查登录状态
		this.checkLogin();
	},
	onShow() {
		// 在页面显示时也检查登录状态
		if(this.checkLogin()) {
			this.loadCustomerList();
		}
	},
	methods: {
		// 检查登录状态
		checkLogin() {
			const isLoggedIn = uni.getStorageSync('isLoggedIn');
			const token = uni.getStorageSync('token');
			const userInfo = uni.getStorageSync('userInfo');
			
			if (!isLoggedIn || !token || !userInfo) {
				console.log('customer页面检测到未登录，准备跳转到登录页');
				
				uni.showToast({
					title: '请先登录',
					icon: 'none',
					duration: 2000
				});
				
				// 直接跳转到登录页
				uni.redirectTo({
					url: '/pages/login/login'
				});
				
				return false;
			}
			return true;
		},
		loadCustomerList() {
			// 显示加载中提示
			uni.showLoading({
				title: '加载中...'
			});

			// 构建请求参数
			const params = {
				page: this.page,
				pageSize: this.pageSize,
				phone: this.phone || '',
				name: this.searchKey || ''
			};

			// 如果有筛选条件，添加到请求参数中
			if (this.filterParams.department) {
				params.branch_id = this.getDepartmentId(this.filterParams.department);
			}

			// 调用API获取客户列表
			customerApi.getList(params)
				.then(res => {
					// 隐藏加载提示
					uni.hideLoading();
					
					if (res.success && res.retCode === 200 && res.data) {
						// 处理返回的数据
						this.customerList = res.data.list || [];
						this.totalCount = res.data.total || 0;
						
						// 如果列表为空，显示提示
						if (this.customerList.length === 0) {
							uni.showToast({
								title: '暂无客户数据',
								icon: 'none'
							});
						}
					} else {
						// 显示错误信息
						uni.showToast({
							title: res.message || '获取客户列表失败',
							icon: 'none'
						});
					}
				})
				.catch(err => {
					// 隐藏加载提示
					uni.hideLoading();
					
					// 显示错误信息
					uni.showToast({
						title: '获取客户列表失败',
						icon: 'none'
					});
					
					console.error('获取客户列表失败', err);
				});
		},
		
		// 获取部门ID
		getDepartmentId(departmentName) {
			const departmentMap = {
				'消费信贷部': '1',
				'小微信贷部': '2'
			};
			return departmentMap[departmentName] || '';
		},
		handleSearch() {
			this.loadCustomerList();
		},
		changeStatusFilter(status) {
			this.statusFilter = status;
			this.loadCustomerList();
		},
		formatDate(timestamp) {
			if (!timestamp) return '';
			const date = new Date(timestamp);
			return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
		},
		getStatusText(status) {
			const map = {
				'1': '新客户',
				'2': '意向客户',
				'3': '已成交',
				'4': '已流失',
				'5': '已移交',
				'new': '新客户',
				'intention': '意向客户',
				'deal': '已成交',
				'lost': '已流失'
			};
			return map[status] || status || '未知';
		},
		getClientType(type) {
			const map = {
				'1': '个人客户',
				'2': '企业客户',
				'3': '个体工商户'
			};
			return map[type] || '未知类型';
		},
		getDealStatus(status) {
			const map = {
				'1': '未审批',
				'2': '审批中',
				'3': '已通过',
				'4': '已拒绝'
			};
			return map[status] || '未知状态';
		},
		getJinduText(jindu) {
			const map = {
				'1': '待审批',
				'2': '审批中',
				'3': '已通过',
				'4': '已拒绝',
				'pending': '待审批',
				'processing': '审批中',
				'approved': '已通过',
				'rejected': '已拒绝'
			};
			return map[jindu] || jindu || '未知';
		},
		goDetail(item) {
			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/detail?id=${item.id}&customerData=${customerData}`
			});
		},
		goEdit(item) {
			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/add?id=${item.id}&customerData=${customerData}`
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
		},
		prevPage() {
			if (this.page > 1) {
				this.page--;
				this.loadCustomerList();
			}
		},
		nextPage() {
			if (this.page < Math.ceil(this.totalCount / this.pageSize)) {
				this.page++;
				this.loadCustomerList();
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

.statusClass-1 {
	background-color: #5ac8fa; /* 新客户 - 蓝色 */
}

.statusClass-2 {
	background-color: #ff9500; /* 意向客户 - 橙色 */
}

.statusClass-3 {
	background-color: #4cd964; /* 已成交 - 绿色 */
}

.statusClass-4 {
	background-color: #8e8e93; /* 已流失 - 灰色 */
}

.statusClass-5 {
	background-color: #007AFF; /* 已移交 - 深蓝色 */
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

/* 分页样式 */
.pagination {
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.pagination-info {
	font-size: 14px;
	color: #606266;
	margin-bottom: 10px;
}

.pagination-btn-group {
	display: flex;
	justify-content: center;
}

.pagination-btn {
	padding: 8px 15px;
	margin: 0 5px;
	background-color: #409EFF;
	color: white;
	border-radius: 4px;
	font-size: 14px;
}

.pagination-btn.disabled {
	background-color: #c0c4cc;
	cursor: not-allowed;
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

.dealClass-1 {
	background-color: #909399; /* 未审批 - 灰色 */
}

.dealClass-2 {
	background-color: #ff9500; /* 审批中 - 橙色 */
}

.dealClass-3 {
	background-color: #4cd964; /* 已通过 - 绿色 */
}

.dealClass-4 {
	background-color: #ff3b30; /* 已拒绝 - 红色 */
}

.client-age {
	font-size: 16px;
	font-weight: bold;
	color: #606266;
	margin-top: 5px;
}

.marital-status {
	font-size: 14px;
	color: #606266;
	margin-top: 5px;
	padding: 2px 8px;
	background-color: #f0f2f5;
	border-radius: 10px;
}
</style>