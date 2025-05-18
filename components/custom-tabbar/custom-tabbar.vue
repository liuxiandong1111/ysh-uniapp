<template>
	<view class="custom-tabbar" :class="{ 'custom-tabbar-ios': isIOS }">
		<view class="tabbar-content">
			<view 
				v-for="(item, index) in tabList" 
				:key="index" 
				class="tabbar-item" 
				:class="{ 'active': currentTab === getTriggerName(item.pagePath) }"
				@click="handleTabClick(item)"
			>
				<image class="tabbar-icon" :src="currentTab === getTriggerName(item.pagePath) ? item.selectedIconPath : item.iconPath"></image>
				<text class="tabbar-text" :class="{ 'active-text': currentTab === getTriggerName(item.pagePath) }">{{ item.text }}</text>
			</view>
		</view>
		<!-- 适配iOS底部安全区 -->
		<view v-if="isIOS" class="safe-area-inset"></view>
	</view>
</template>

<script>
	import tabbarUtils from '@/utils/tabbarUtils.js';
	
	export default {
		name: 'CustomTabbar',
		props: {
			// 当前选中的tabbar索引或名称
			active: {
				type: [String, Number],
				default: 'dashboard'
			}
		},
		data() {
			return {
				currentTab: 'dashboard', // 当前选中的标签页
				isIOS: false,
				tabList: []
			};
		},
		watch: {
			// 监听外部传入的active变化
			active: {
				handler(val) {
					this.currentTab = val;
				},
				immediate: true
			}
		},
		created() {
			// 初始化tabbar配置
			this.initTabBar();
			
			// #ifdef APP-PLUS || MP-WEIXIN
			// 检测是否为iOS设备
			const system = uni.getSystemInfoSync();
			this.isIOS = system.platform === 'ios';
			// #endif
			
			// 设置初始选中项
			this.currentTab = this.active;
		},
		methods: {
			// 初始化tabbar配置
			initTabBar() {
				// 获取用户权限
				const permissions = uni.getStorageSync('permissions');
				
				if (permissions) {
					// 根据权限选择合适的tabbar类型
					const tabbarType = this.getTabBarTypeByPermissions(permissions);
					
					// 保存当前tabbar类型
					uni.setStorageSync('tabBarType', tabbarType);
					
					// 加载对应类型的tabbar配置
					this.loadTabbarConfig(tabbarType);
				} else {
					// 如果没有权限信息，加载默认配置
					this.loadTabbarConfig('default');
				}
			},
			
			// 根据权限获取tabbar类型
			getTabBarTypeByPermissions(permissions) {
				// 根据不同权限组合确定tabbar类型
				if (permissions.customer && !permissions.loan) {
					return 'manager'; // 客户经理
				} else if (!permissions.customer && permissions.loan) {
					return 'loanOfficer'; // 贷款专员
				} else if (permissions.customer && permissions.loan) {
					return 'default'; // 具有全部权限
				} else {
					return 'default'; // 默认配置
				}
			},
			
			// 加载tabbar配置
			loadTabbarConfig(type) {
				// 获取tabbar配置库
				const tabbarConfigs = {
					// 默认tabbar配置
					default: [
						{
							pagePath: "pages/dashboard/dashboard",
							text: "首页",
							iconPath: "/static/images/home.png",
							selectedIconPath: "/static/images/home_active.png"
						},
						{
							pagePath: "pages/customer/customer",
							text: "客户",
							iconPath: "/static/images/customer.png",
							selectedIconPath: "/static/images/customer_active.png"
						},
						{
							pagePath: "pages/loan/loan",
							text: "贷款",
							iconPath: "/static/images/loan.png",
							selectedIconPath: "/static/images/loan_active.png"
						},
						{
							pagePath: "pages/message/message",
							text: "消息",
							iconPath: "/static/images/message.png",
							selectedIconPath: "/static/images/message_active.png"
						}
					],
					// 客户经理tabbar配置
					manager: [
						{
							pagePath: "pages/dashboard/dashboard",
							text: "首页",
							iconPath: "/static/images/home.png",
							selectedIconPath: "/static/images/home_active.png"
						},
						{
							pagePath: "pages/customer/customer",
							text: "客户",
							iconPath: "/static/images/customer.png",
							selectedIconPath: "/static/images/customer_active.png"
						},
						{
							pagePath: "pages/message/message",
							text: "消息",
							iconPath: "/static/images/message.png",
							selectedIconPath: "/static/images/message_active.png"
						}
					],
					// 贷款专员tabbar配置
					loanOfficer: [
						{
							pagePath: "pages/dashboard/dashboard",
							text: "首页",
							iconPath: "/static/images/home.png",
							selectedIconPath: "/static/images/home_active.png"
						},
						{
							pagePath: "pages/loan/loan",
							text: "贷款",
							iconPath: "/static/images/loan.png",
							selectedIconPath: "/static/images/loan_active.png"
						},
						{
							pagePath: "pages/message/message",
							text: "消息",
							iconPath: "/static/images/message.png",
							selectedIconPath: "/static/images/message_active.png"
						}
					]
				};
				
				// 设置当前tabbar列表
				this.tabList = tabbarConfigs[type] || tabbarConfigs.default;
			},
			
			// 获取页面路径对应的触发名称
			getTriggerName(path) {
				if (!path) return '';
				
				// 从路径中提取tab名称，例如 pages/dashboard/dashboard => dashboard
				const parts = path.split('/');
				return parts[1] || '';
			},
			
			// 处理tab点击事件
			handleTabClick(item) {
				// 获取当前点击tab的名称
				const tabName = this.getTriggerName(item.pagePath);
				
				// 如果当前已经是该页面，不做处理
				if (this.currentTab === tabName) return;
				
				// 更新当前选中的tab
				this.currentTab = tabName;
				
				// 检查用户是否有权限访问该tab
				const permissions = uni.getStorageSync('permissions');
				if (permissions && !this.hasPermission(item.pagePath, permissions)) {
					// 如果没有权限，则不允许切换
					uni.showToast({
						title: '您没有权限访问该页面',
						icon: 'none'
					});
					return;
				}
				
				// 发送事件通知父组件tab变化
				this.$emit('change', tabName);
				
				// 使用switchTab跳转到对应的tabBar页面
				uni.switchTab({
					url: '/' + item.pagePath,
					fail: (err) => {
						console.error('跳转失败:', err);
						// 如果switchTab失败（可能是自定义tabbar的情况），尝试使用reLaunch
						uni.reLaunch({
							url: '/' + item.pagePath
						});
					}
				});
			},
			
			// 检查是否有权限访问页面
			hasPermission(pagePath, permissions) {
				// 首页和消息页面所有人都可访问
				if (pagePath.indexOf('dashboard') !== -1 || pagePath.indexOf('message') !== -1) {
					return true;
				}
				
				// 客户页面需要customer权限
				if (pagePath.indexOf('customer') !== -1) {
					return permissions.customer === true;
				}
				
				// 贷款页面需要loan权限
				if (pagePath.indexOf('loan') !== -1) {
					return permissions.loan === true;
				}
				
				return true;
			}
		}
	}
</script>

<style>
.custom-tabbar {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	height: 50px;
	background-color: #FFFFFF;
	box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.1);
	z-index: 999;
	display: flex;
	flex-direction: column;
}

.custom-tabbar-ios {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

.tabbar-content {
	display: flex;
	height: 50px;
}

.tabbar-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 5px 0;
}

.tabbar-icon {
	width: 24px;
	height: 24px;
	margin-bottom: 2px;
}

.tabbar-text {
	font-size: 10px;
	color: #909399;
}

.active-text {
	color: #409EFF;
}

.safe-area-inset {
	height: constant(safe-area-inset-bottom);
	height: env(safe-area-inset-bottom);
}
</style> 