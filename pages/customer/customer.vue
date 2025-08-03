<template>
	<view class="container">
		<view class="search-bar">
			<view class="search-bar-wrap">
				<view class="search-input-wrap">
					<view class="search-icon">
						<text class="iconfont">🔍</text>
					</view>
				<input class="search-input" type="text" @confirm="handleSearch" placeholder="搜索客户姓名"
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

				<view class="form-row">
					<view class="form-group">
						<text class="form-label">年龄</text>
						<input class="form-select" type="text" v-model="age" placeholder="请输入年龄"
							style="height: 30px;font-size: 14px;" />
					</view>
					<view class="form-group">
						<text class="form-label">所属客群</text>
						<picker :range="belongingCustomerGroup" range-key="label" @change="handleCustomerGroupChange" class="form-select">
							<view class="picker-value">{{ getCustomerGroupText() }}</view>
						</picker>
					</view>
				</view>

				<view class="form-row">
					<view class="form-group">
						<text class="form-label">业务负责人</text>
						<picker :range="productManagers" range-key="name" @change="handleManagerChange" class="form-select">
							<view class="picker-value" v-if="!isLoading">{{ selectedManager ? selectedManager.name : '请选择产品经理' }}</view>
							<view class="picker-value" v-else>加载中...</view>
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
								<text class="label">客户分类:</text>
								<text>{{ item.client_level || '' }}</text>
							</view>
							<view class="dept">
								<text class="label">所属客群:</text>
								<text>{{ dictMaps.customerType[item.client_type] || '' }}</text>
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

				<view class="empty-tip" v-if="customerList.length === 0 && !isLoading">
					暂无客户数据
				</view>
				
				<!-- 加载更多提示 -->
				<view class="loading-more" v-if="customerList.length > 0">
					<text v-if="isLoading">加载中...</text>
					<text v-else-if="hasMore">上拉加载更多</text>
					<text v-else>没有更多数据了</text>
				</view>
			</view>
		</view>

		<view class="add-fab" @click="goAdd">
			<text style="transform: translateY(-2px);">+</text>
		</view>
	</view>
</template>

<script>
import customerApi from '@/api/customer.js';
import { employee } from '@/api/organization.js';
import { dictMaps, getLabelByValue, customerType, customerStatus, dealStatus, customerProgress, belongingCustomerGroup } from '@/utils/dict.js';
import { department } from '@/api/organization.js';
import tabbarUtils from '../../utils/tabbarUtils.js';

export default {
	data() {
		// 基于字典构建选项数组
		const buildOptions = (dictArray) => {
			return ['全部', ...dictArray.map(item => item.label)];
		};
		
		return {
			searchKey: '',
			phone: '',
			age: '',
			statusFilter: 'all',
			customerList: [],
			showFilterForm: false,
			departmentOptions: ['全部'], // 初始化为包含"全部"选项的数组
			departmentData: [], // 存储完整的部门数据
			currentDepartment: 0,
			statusOptions: buildOptions(customerStatus), // 使用customerStatus字典构建
			currentStatus: 0,
			approvalOptions: buildOptions(customerProgress), // 使用customerProgress字典构建
			currentApproval: 0,
			customerGroupOptions: ['全部', '消费', '经营', '消费经营'],
			belongingCustomerGroup: belongingCustomerGroup,
			currentCustomerGroup: 0,
			// 存储原始字典数据以便后续使用
			statusDict: customerStatus,
			approvalDict: customerProgress,
			filterParams: {
				department: '',
				branchId: '',
				status: '',
				approvalStatus: '',
				customerGroup: '',
				client_type: ''
			},
			page: 1,
			pageSize: 5,
			totalCount: 0,
			dictMaps: dictMaps,
			isLoading: false,
			hasMore: true,
			productManagers: [],
			selectedManagerId: null,
			selectedManager: null,
		}
	},
	onLoad() {
		
		// 检查登录状态
		this.checkLogin();
		this.getDeptTree()
		this.loadProductManagers();

		// 监听刷新列表事件
		uni.$on('refreshCustomerList', this.refreshCustomerList);
	},
	onShow() {
		// 在页面显示时也检查登录状态
		if(this.checkLogin()) {
			this.loadCustomerList(true);
		}

		// 检查权限
		const permissions = uni.getStorageSync('permissions');
		if (!permissions || !permissions.customer) {
			uni.showToast({
				title: '您没有权限访问客户管理',
				icon: 'none',
				duration: 2000
			});
			
			// 延迟后跳转到首页
			setTimeout(() => {
				uni.switchTab({
					url: '/pages/dashboard/dashboard'
				});
			}, 1000);
			return;
		}
	},
	onReachBottom() {
		if (this.hasMore && !this.isLoading) {
			this.loadMore();
		}
	},
	onUnload() {
		// 页面卸载时移除事件监听
		uni.$off('refreshCustomerList', this.refreshCustomerList);
	},
	methods: {
		async loadProductManagers() {
			const userInfo = uni.getStorageSync('userInfo');
			try {
				const res = await employee.getList({
					branch_id: userInfo.branch_id,
					page: 1,
					pageSize: 100
				});
				
				if (res && res.data && res.data.list) {
					this.productManagers = res.data.list;
				} else {
					this.productManagers = [];
				}
			} catch (error) {
				this.productManagers = [];
				uni.showToast({
					title: error.message,
					icon: 'none'
				});
			}
		},

		handleManagerChange(e) {
			const index = e.detail.value;
			this.selectedManager = this.productManagers[index];
			this.selectedManagerId = this.selectedManager.id;
		},
		
		// 刷新客户列表（用于事件监听）
		refreshCustomerList() {
			this.loadCustomerList(true);
		},

		async getDeptTree() {
			try {
				const res = await department.getTreeList()
				console.log(res, 'res')

				if (res.success && res.retCode === 200 && res.data && res.data.length > 0) {
					// 提取部门数据
					const deptData = res.data[0].children || [];
					// 保存完整部门数据以供后续使用
					this.departmentData = deptData;
					// 设置部门选项列表，"全部"已在初始化时添加
					this.departmentOptions = ['全部', ...deptData.map(item => item.branch_name)];
				} else {
					this.departmentOptions = ['全部'];
					this.departmentData = [];
				}
			} catch (error) {
				console.error('获取部门数据失败', error);
				this.departmentOptions = ['全部'];
				this.departmentData = [];
			}
		},

		// 加载更多数据
		loadMore() {
			if (this.hasMore && !this.isLoading) {
				this.page++;
				this.loadCustomerList(false);
			}
		},

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
		loadCustomerList(isReset = true) {

			// 已无更多数据时不再请求
			if (!this.hasMore) {
				return;
			}

			// 设置加载状态
			this.isLoading = true;

			// 构建请求参数
			const params = {
				page: this.page,
				page_size: this.pageSize,
				phone: this.phone || '',
				age: this.age || '',
				name: this.searchKey || '',
				service_id: this.selectedManagerId
			};

			// 如果有部门筛选条件，添加到请求参数中
			if (this.filterParams.branchId) {
				params.branch_id = this.filterParams.branchId;
			} else {
				params.branch_id = '';
			}
			
			console.log(this.filterParams.status, 'this.filterParams.status')
			// 添加客户状态筛选条件
			if (this.filterParams.status) {
				params.status = this.filterParams.status;
			} else {
				params.status = '';
			}
			
			// 添加审批状态筛选条件
			if (this.filterParams.approvalStatus) {
				params.deal_status = this.filterParams.approvalStatus;
			} else {
				params.deal_status = '';
			}

			// 添加审批状态筛选条件
			if (this.filterParams.client_type) {
				params.client_type = this.filterParams.client_type;
			} else {
				params.client_type = '';
			}

			// 调用API获取客户列表
			customerApi.getList(params)
				.then(res => {
					if (res.success && res.retCode === 200 && res.data) {
						// 获取新数据
						const newList = res.data.list || [];

						// 更新总数量
						this.totalCount = res.data.total || 0;

						
						// 追加或替换数据
						if (isReset) {
							this.customerList = newList;
						} else {
							this.customerList = [...this.customerList, ...newList];
						}

						// 判断是否还有更多数据
						this.hasMore = newList.length >= this.pageSize && this.customerList.length < this.totalCount;

						// 列表为空时显示提示
						if (isReset && this.customerList.length === 0) {
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

					// 设置加载状态为false
					this.isLoading = false;
				})
				.catch(err => {

					// 显示错误信息
					uni.showToast({
						title: err.message,
						icon: 'none'
					});

					console.error('获取客户列表失败', err);

					// 设置加载状态为false
					this.isLoading = false;
				});
		},

			// 不再需要映射，直接使用API返回的部门ID
		handleSearch() {
			this.loadCustomerList(true);
		},
		changeStatusFilter(status) {
			this.statusFilter = status;
			this.loadCustomerList(true);
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
				1: '消费',
				2: '经营',
				3: '消费经营'
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
			uni.setStorageSync('page', this.page);

			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/detail?id=${item.id}&customerData=${customerData}`
			});
		},
		goEdit(item) {
			uni.setStorageSync('page', this.page);
			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/add?id=${item.id}&customerData=${customerData}`
			});
		},
		goFollowup(item) {
			uni.setStorageSync('page', this.page);
			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/followup/followup?id=${item.id}&customerData=${customerData}`
			});
		},
		updateStatus(item) {
			uni.setStorageSync('page', this.page);
			// 将客户数据编码为URL参数
			const customerData = encodeURIComponent(JSON.stringify(item));
			console.log('updateStatus')
			uni.navigateTo({
				url: `/pages/customer/status?id=${item.id}&customerData=${customerData}`
			});
		},
		transferCustomer(item) {
			uni.setStorageSync('page', this.page);
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/transfer?id=${item.id}&customerData=${customerData}`
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
			
			if (this.currentDepartment === 0) {
				// 选择"全部"时，不设置部门筛选
				this.filterParams.department = '';
				this.filterParams.branchId = '';
			} else {
				// 选择具体部门时，获取部门信息
				const selectedIndex = this.currentDepartment - 1; // 因为第一个是"全部"
				if (selectedIndex >= 0 && selectedIndex < this.departmentData.length) {
					const dept = this.departmentData[selectedIndex];
					this.filterParams.department = dept.branch_name;
					this.filterParams.branchId = dept.id;
				}
			}
		},
		statusChange(e) {
			this.currentStatus = e.detail.value;
			if (e.detail.value == 0) {
				// 选择"全部"时，不设置状态筛选
				this.filterParams.status = '';
			} else {
				// 选择具体状态时，使用对应的value值
				const selectedIndex = e.detail.value - 1; // 因为第一个是"全部"
				if (selectedIndex >= 0 && selectedIndex < this.statusDict.length) {
					this.filterParams.status = this.statusDict[selectedIndex].value;
				}
			}
		},
		approvalChange(e) {
			this.currentApproval = e.detail.value;
			if (e.detail.value == 0) {
				// 选择"全部"时，不设置审批状态筛选
				this.filterParams.approvalStatus = '';
			} else {
				// 选择具体审批状态时，使用对应的value值
				const selectedIndex = e.detail.value - 1; // 因为第一个是"全部"
				if (selectedIndex >= 0 && selectedIndex < this.approvalDict.length) {
					this.filterParams.approvalStatus = this.approvalDict[selectedIndex].value;
				}
			}
		},
		resetFilters() {
			this.currentDepartment = 0;
			this.currentStatus = 0;
			this.currentApproval = 0;
			this.currentCustomerGroup = 0;
			this.filterParams = {
				department: '',
				branchId: '',
				status: '',
				approvalStatus: '',
				customerGroup: ''
			};
			uni.showToast({
				title: '筛选已重置',
				icon: 'none'
			});
		},
		customerGroupChange(e) {
			this.currentCustomerGroup = e.detail.value;
			this.filterParams.customerGroup = this.currentCustomerGroup === 0 ? '' : this.currentCustomerGroup;
		},
		applyFilters() {
			this.loadCustomerList(true);
			uni.showToast({
				title: '筛选条件已应用',
				icon: 'none'
			});
			this.showFilterForm = false;
		},
		handleCustomerGroupChange(e) {
			const index = e.detail.value;
			this.filterParams.client_type = this.belongingCustomerGroup[index].value;
		},
		getCustomerGroupText() {
			const group = this.filterParams.client_type;
			const found = this.belongingCustomerGroup.find(item => item.value === group);
			return found ? found.label : '请选择客群';
		},
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
  color: #fff;
  font-size: 30px;
}

.add-fab .iconfont {
	font-size: 24px;
	color: white;
}

/* 加载更多提示 */
.loading-more {
	text-align: center;
	padding: 10px;
	color: #909399;
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