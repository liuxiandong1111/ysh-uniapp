<template>
	<view class="tabbar-container">
		<!-- 页面内容区域 - 这是自定义tabbar的容器页面 -->
		<view class="page-content">
			<!-- 指引用户使用tabbar导航 -->
			<view class="welcome-content">
				<view class="welcome-logo">元</view>
				<view class="welcome-title">欢迎使用元圣行管理系统</view>
				<view class="welcome-subtitle">请点击下方导航栏选择功能</view>
			</view>
		</view>
		
		<!-- 自定义tabbar -->
		<custom-tabbar :active="currentTab" />
	</view>
</template>

<script>
	import CustomTabbar from '@/components/custom-tabbar/custom-tabbar.vue';
	
	export default {
		components: {
			CustomTabbar
		},
		data() {
			return {
				currentTab: 'dashboard' // 当前选中的标签页
			};
		},
		onLoad() {
			// 初始化默认显示首页
			this.currentTab = 'dashboard';
		}
	}
</script>

<style>
	.tabbar-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}
	
	.page-content {
		flex: 1;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		padding-bottom: 50px; /* 底部留出自定义tabbar的高度 */
		display: flex;
		justify-content: center;
		align-items: center;
	}
	
	.welcome-content {
		text-align: center;
		padding: 30px;
	}
	
	.welcome-logo {
		width: 80px;
		height: 80px;
		line-height: 80px;
		border-radius: 20px;
		background-color: #409EFF;
		color: #FFFFFF;
		font-size: 28px;
		font-weight: bold;
		margin: 0 auto 20px;
	}
	
	.welcome-title {
		font-size: 20px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 10px;
	}
	
	.welcome-subtitle {
		font-size: 14px;
		color: #909399;
	}
</style> 