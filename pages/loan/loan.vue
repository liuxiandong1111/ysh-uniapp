<template>
	<view class="container">
		<view class="main">
			<view class="search-bar">
				<view class="search-input-wrap">
					<view class="search-icon">
						<text class="iconfont">🔍</text>
					</view>
					<input class="search-input" type="text" v-model="searchKey" placeholder="搜索客户姓名或手机号" @confirm="searchCustomers" />
				</view>
				<view class="search-btn" @click="searchCustomers">搜索</view>
			</view>

			<view class="customer-list">
				<view class="customer-card" v-for="(item, index) in pendingCustomerList" :key="index">
					<view class="customer-info">
						<view class="customer-header">
							<text class="customer-name">{{ item.name }}</text>
							<text class="customer-status" :class="'status-' + getStatusClass(item.deal_status)">{{ getDealStatus(item.deal_status) }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">手机号:</text>
							<text class="info-value">{{ item.phone }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">所属客群:</text>
							<text class="info-value">{{ getClientType(item.client_type) }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">业务员:</text>
							<text class="info-value">{{ item.service_name }}</text>
						</view>
						<view class="info-row">
							<text class="info-label">产品员:</text>
							<text class="info-value">{{ item.product_name || '未分配' }}</text>
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

				<view class="empty-tip" v-if="pendingCustomerList.length === 0 && !isLoading">
					暂无待处理客户数据
				</view>
				
				<!-- 加载更多提示 -->
				<view class="loading-more" v-if="pendingCustomerList.length > 0">
					<text v-if="isLoading">加载中...</text>
					<text v-else-if="hasMore">上拉加载更多</text>
					<text v-else>没有更多数据了</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import financeApi from '@/api/finance.js';

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
			pendingCustomerList: [],
			// 分页相关状态
			currentPage: 1,
			pageSize: 10,
			total: 0,
			isLoading: false,
			hasMore: true
		}
	},
	onLoad(option) {
		// 如果从客户页面跳转过来，会带上客户名称
		if (option.customer) {
			this.customerForm.name = option.customer;
		}

		// 加载待处理客户列表
		this.loadPendingCustomers(true);
	},
	// 上拉触底事件
	onReachBottom() {
		if (this.hasMore && !this.isLoading) {
			this.loadMore();
		}
	},
	methods: {
		// 切换标签
		switchTab(index) {
			this.activeTab = index;
			if (index === 1) {
				this.loadPendingCustomers(true);
			}
		},

		// 加载更多数据
		loadMore() {
			if (this.hasMore && !this.isLoading) {
				this.currentPage++;
				this.loadPendingCustomers(false);
			}
		},

		// 加载待处理客户列表
		async loadPendingCustomers(isReset = true) {
			// 如果是重置，则清空列表并回到第一页
			if (isReset) {
				this.currentPage = 1;
				this.pendingCustomerList = [];
				this.hasMore = true;
			}
			
			// 已无更多数据时不再请求
			if (!this.hasMore) {
				return;
			}
			
			this.isLoading = true;
			
			if (isReset) {
				uni.showLoading({
					title: '加载中...'
				});
			}
			
			try {
				const response = await financeApi.getFinanceList({
					name: this.searchKey,
					page: this.currentPage,
					page_size: this.pageSize
				});
				
				if (response && response.retCode === 200) {
					const newList = response.data.list || [];
					
					// 追加数据而非替换
					if (isReset) {
						this.pendingCustomerList = newList;
					} else {
						this.pendingCustomerList = [...this.pendingCustomerList, ...newList];
					}
					
					this.total = response.data.total || 0;
					
					// 判断是否还有更多数据
					this.hasMore = newList.length >= this.pageSize && this.pendingCustomerList.length < this.total;
					
					if (isReset && this.pendingCustomerList.length === 0) {
						uni.showToast({
							title: '暂无贷款数据',
							icon: 'none'
						});
					}
				} else {
					uni.showToast({
						title: response.retMsg || '获取贷款列表失败',
						icon: 'none'
					});
				}
			} catch (error) {
				console.error('获取贷款列表失败:', error);
				uni.showToast({
					title: '获取贷款列表失败',
					icon: 'none'
				});
			} finally {
				if (isReset) {
					uni.hideLoading();
				}
				this.isLoading = false;
			}
		},

		// 搜索客户
		searchCustomers() {
			// 重置并搜索
			this.loadPendingCustomers(true);
		},

		// 获取状态样式类
		getStatusClass(status) {
			if (!status) return 'pending';

			const statusMap = {
				'1': 'pending',
				'2': 'processing',
				'3': 'approved',
				'4': 'rejected'
			};

			return statusMap[status] || 'pending';
		},
		// 审批状态文本转换
		getDealStatus(status) {
			const statusMap = {
				1: '待处理',
				2: '审批中',
				3: '已审批',
				4: '已拒绝'
			}
			return statusMap[status] || '未知'
		},	

		// 客户类型转换
		getClientType (type) {
			const typeMap = {
				1: '消费',
				2: '经营',
				3: '消费经营'
			}
			return typeMap[type] || '未知'
		},

		// 查看客户详情
		handleViewCustomer(item) {
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/customer/detail?id=${item.id}&customerData=${customerData}&type=loan`
			});
		},

		// 为客户创建贷款
		handleCreateLoan(item) {
			// 跳转到贷款申请页面，并传递客户ID
			const customerData = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: `/pages/loan/apply?id=${item.id}&customerData=${customerData}`
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

/* 加载更多提示样式 */
.loading-more {
	text-align: center;
	color: #909399;
	padding: 10px;
	border-radius: 8px;
}
</style>