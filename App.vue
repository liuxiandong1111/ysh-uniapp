<script>
	import tabbarUtils from './utils/tabbarUtils.js';
	
	export default {
		data() {
			return {
				badgeUpdateTimer: null // 角标更新定时器
			}
		},
		onLaunch: function() {
			console.log('App Launch');
			// 初始化应用，检查登录状态
			this.checkLoginState();
			// 初始化消息角标
			this.initMessageBadge();
			// 启动角标定时更新
			this.startBadgePolling();
		},
		onShow: function() {
			let isChoosingImage = uni.getStorageSync('isChoosingImage');
			if (isChoosingImage) {
				uni.setStorageSync('isChoosingImage', false);
				return
			}
			// 在应用进入前台时检查配置
			this.checkLoginState();
			
			// 检查当前页面权限
			this.checkCurrentPagePermission();
			
			// 更新消息角标
			this.initMessageBadge();
			
			// 如果定时器不存在，重新启动
			if (!this.badgeUpdateTimer) {
				this.startBadgePolling();
			}
		},
		onHide: function() {
			console.log('App Hide');
			// 应用进入后台时，可以暂停轮询以节省资源
			// 这里可以选择是否清除定时器
			// this.clearBadgePolling();
		},
		beforeDestroy: function() {
			// 组件销毁前清除定时器
			this.clearBadgePolling();
		},
		methods: {
			// 启动角标轮询更新
			startBadgePolling() {
				// 如果已经存在定时器，先清除
				this.clearBadgePolling();
				
				// 创建新的定时器，60秒查询一次
				this.badgeUpdateTimer = setInterval(() => {
					console.log('轮询更新消息角标');
					this.initMessageBadge();
				}, 60000); // 60000毫秒 = 1分钟
			},
			
			// 清除角标轮询
			clearBadgePolling() {
				if (this.badgeUpdateTimer) {
					clearInterval(this.badgeUpdateTimer);
					this.badgeUpdateTimer = null;
				}
			},
			
			// 初始化消息角标
			initMessageBadge() {
				// 检查是否已登录
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				if (!isLoggedIn) return; // 未登录不更新角标
				
				// 更新消息角标
				tabbarUtils.updateMessageBadge(1); // 假设消息tab的索引是1
			},
			
			// 检查登录状态
			checkLoginState() {
				// 检查是否已登录
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				console.log('检查登录状态:', isLoggedIn);
				
				if (isLoggedIn) {
					// 导航到主页
					this.navigateToMainPage();
				} else {
					// 如果未登录，检查当前是否在登录页，如果不在则导航到登录页
					this.navigateToLoginIfNeeded();
				}
			},
			
			// 导航到主页
			navigateToMainPage() {
				// 检查是否已登录
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				
				if (!isLoggedIn) {
					// 如果未登录，导航到登录页
					this.navigateToLoginIfNeeded();
					return;
				}
				
				// 如果已登录，检查当前是否在tabbar页面
				const currentPages = getCurrentPages();
				if (currentPages.length > 0) {
					const currentRoute = currentPages[currentPages.length - 1].route;
					
					// 如果在登录页，则跳转到首页
					if (currentRoute === 'pages/login/login') {
						uni.switchTab({
							url: '/pages/dashboard/dashboard'
						});
						return;
					}
					
					// 如果已经在tabbar页面之一，不再跳转，但检查权限
					if (this.isInTabbarPage(currentRoute)) {
						this.checkCurrentPagePermission();
						return;
					}
				}
				
				// 如果是应用启动，可能页面栈为空，直接跳转到首页
				if (currentPages.length === 0 || !this.isInTabbarPage(currentPages[currentPages.length - 1].route)) {
					uni.switchTab({
						url: '/pages/dashboard/dashboard'
					});
				}
			},
			
			// 如果需要，导航到登录页
			navigateToLoginIfNeeded() {
				const currentPages = getCurrentPages();
				const currentRoute = currentPages.length > 0 ? currentPages[currentPages.length - 1].route : '';
				
				if (currentRoute !== 'pages/login/login') {
					uni.reLaunch({
						url: '/pages/login/login'
					});
				}
			},
			
			// 检查当前是否在tabbar页面
			isInTabbarPage(route) {
				// 判断是否是tabbar页面
				return route === 'pages/dashboard/dashboard' || 
					   route === 'pages/customer/customer' || 
					   route === 'pages/loan/loan' || 
					   route === 'pages/message/message';
			},
			
			// 检查当前页面访问权限
			checkCurrentPagePermission() {
				const isLoggedIn = uni.getStorageSync('isLoggedIn');
				if (!isLoggedIn) return; // 未登录不检查权限
				
				const permissions = uni.getStorageSync('permissions');
				if (!permissions) return; // 无权限配置不检查
				
				const pages = getCurrentPages();
				if (pages.length === 0) return; // 无页面不检查
				
				const currentPage = pages[pages.length - 1];
				const currentPath = currentPage.route;
				
				console.log('当前页面路径:', currentPath);
				
				// 如果是tabbar页面，检查是否有权限访问
				if (currentPath.indexOf('pages/customer') !== -1) {
					// 检查是否有权限访问客户页面
					if (!permissions.customer) {
						console.log('无权限访问客户页面，跳转到首页');
						// 显示无权限提示
						uni.showToast({
							title: '您没有权限访问该页面',
							icon: 'none',
							duration: 2000
						});
						
						// 延迟后跳转到首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/dashboard/dashboard'
							});
						}, 500);
					}
				} else if (currentPath.indexOf('pages/loan') !== -1) {
					// 检查是否有权限访问贷款页面
					if (!permissions.loan) {
						console.log('无权限访问贷款页面，跳转到首页');
						// 显示无权限提示
						uni.showToast({
							title: '您没有权限访问该页面',
							icon: 'none',
							duration: 2000
						});
						
						// 延迟后跳转到首页
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/dashboard/dashboard'
							});
						}, 500);
					}
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import './static/fonts/iconfont.css';
</style>
