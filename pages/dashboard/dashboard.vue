<template>
	<view class="container">
		<view class="header">
			<text class="header-title">数据仪表盘</text>
			<view class="user-info" @click="goToResetPassword">
				<text>修改密码</text>
			</view>
		</view>
		
		<view class="main">
			<view class="stat-cards">
				<view class="stat-card">
					<text class="label">总客户数</text>
					<text class="number">{{ clientCountNum }}</text>
				</view>
				<view class="stat-card">
					<text class="label">本月新增</text>
					<text class="number">{{ monthNewAddClientNum }}</text>
				</view>
				<view class="stat-card" style="width: 100%;">
					<text class="label">本月放款</text>
					<text class="number">¥{{ monthLoanMoney }}</text>
				</view>
			</view>
			
			<view class="activity-list">
				<text class="section-title">最近活动</text>
				
				<view v-if="followUpLogList.length === 0" style="text-align: center; padding: 20px;">
					<text style="color: #909399;">暂无活动数据</text>
				</view>
				
				<view v-else>
					<view class="activity-item" v-for="(item, index) in followUpLogList" :key="index">
						<view class="activity-icon primary">📝</view>
						<view class="activity-content">
							<text class="activity-title">{{ item.info }}</text>
							<text class="activity-time">{{ item.ctime }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { getStatisticData } from '../../api/dashboard.js';
	import tabbarUtils from '../../utils/tabbarUtils.js';
	
	export default {
		data() {
			return {
				// 统计数据
				clientCountNum: 0,
				monthNewAddClientNum: 0,
				monthLoanMoney: 0,
				
				// 活动列表
				followUpLogList: []
			}
		},
		onLoad() {
			this.getStatisticDataFn();
		},
		onShow() {
			// App.vue 中已经处理了 tabbar 相关逻辑，这里不再需要单独处理
		},
		methods: {
			// 跳转到重置密码页面
			goToResetPassword() {
				uni.navigateTo({
					url: '/pages/user/reset-password'
				});
			},
			
			// 获取统计数据
			async getStatisticDataFn() {
				try {
					uni.showLoading({
						title: '加载中...'
					});
					
					const res = await getStatisticData();
					console.log('统计数据:', res);
					
					if (res.success && res.retCode === 200 && res.data) {
						this.clientCountNum = res.data.client_count_num || 0;
						this.monthNewAddClientNum = res.data.month_new_add_client_num || 0;
						this.monthLoanMoney = res.data.month_loan_money || 0;
						this.followUpLogList = res.data.follow_up_log_list || [];
					} else {
						uni.showToast({
							title: res.message || '获取统计数据失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取统计数据失败', error);
					uni.showToast({
						title: '获取统计数据失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
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
	
	.header {
		padding: 15px;
		background-color: #409EFF;
		color: white;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	
	.header-title {
		font-size: 18px;
		font-weight: bold;
	}
	
	.user-info {
		display: flex;
		align-items: center;
	}
	
	.avatar {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background-color: #fff;
		color: #409EFF;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
		margin-left: 10px;
	}
	
	.main {
		flex: 1;
		padding: 15px;
	}
	
	.stat-cards {
		display: flex;
		gap: 15px;
		flex-wrap: wrap;
		margin-bottom: 20px;
	}
	
	.stat-card {
		width: calc(50% - 40px);
		background-color: #fff;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
		text-align: center;
	}
	
	.stat-card .number {
		font-size: 24px;
		font-weight: bold;
		color: #409EFF;
		margin: 10px 0;
		display: block;
	}
	
	.stat-card .label {
		color: #909399;
		font-size: 14px;
	}
	
	.trend {
		font-size: 12px;
		margin-left: 5px;
	}
	
	.trend.up {
		color: #67C23A;
	}
	
	.trend.down {
		color: #F56C6C;
	}
	
	.section-title {
		font-size: 16px;
		margin-bottom: 15px;
		color: #303133;
		font-weight: 500;
		display: block;
	}
	
	.activity-list {
		background-color: #fff;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
	}
	
	.activity-item {
		display: flex;
		margin-bottom: 15px;
		border-left: 2px solid #409EFF;
		padding-left: 15px;
	}
	
	.activity-item:last-child {
		margin-bottom: 0;
	}
	
	.activity-content {
		flex: 1;
	}
	
	.activity-title {
		font-weight: 500;
		margin-bottom: 5px;
	}
	
	.activity-time {
		color: #909399;
		font-size: 12px;
	}
	
	.activity-icon {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 10px;
		color: white;
		font-size: 16px;
	}
	
	.activity-icon.primary {
		background-color: #409EFF;
	}
	
	.activity-icon.success {
		background-color: #67C23A;
	}
	
	.activity-icon.warning {
		background-color: #E6A23C;
	}
	
	.activity-icon.info {
		background-color: #909399;
	}
</style>