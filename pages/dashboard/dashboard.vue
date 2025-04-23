<template>
	<view class="container">
		<view class="header">
			<text class="header-title">数据仪表盘</text>
			<view class="user-info">
				<text>张经理</text>
				<view class="avatar">张</view>
			</view>
		</view>
		
		<view class="main">
			<view class="stat-cards">
				<view class="stat-card">
					<text class="label">待处理贷款</text>
					<text class="number">12</text>
					<text class="trend up">↑ 2.5%</text>
				</view>
				<view class="stat-card">
					<text class="label">本月新增客户</text>
					<text class="number">48</text>
					<text class="trend up">↑ 12.8%</text>
				</view>
				<view class="stat-card">
					<text class="label">本月放款总额</text>
					<text class="number">¥1.68M</text>
					<text class="trend down">↓ 5.3%</text>
				</view>
				<view class="stat-card">
					<text class="label">逾期率</text>
					<text class="number">1.2%</text>
					<text class="trend up">↑ 0.3%</text>
				</view>
			</view>
			
			<view class="chart-container">
				<view class="chart-header">
					<text class="section-title">业务趋势</text>
					<view class="chart-actions">
						<text class="chart-action active">周</text>
						<text class="chart-action">月</text>
						<text class="chart-action">年</text>
					</view>
				</view>
				<view class="chart">
					<text>图表区域</text>
				</view>
			</view>
			
			<view class="activity-list">
				<text class="section-title">最近活动</text>
				
				<view class="activity-item">
					<view class="activity-icon primary">📝</view>
					<view class="activity-content">
						<text class="activity-title">李四提交了新的贷款申请</text>
						<text class="activity-time">2小时前</text>
					</view>
				</view>
				
				<view class="activity-item">
					<view class="activity-icon success">✅</view>
					<view class="activity-content">
						<text class="activity-title">王五的贷款申请已审批通过</text>
						<text class="activity-time">4小时前</text>
					</view>
				</view>
				
				<view class="activity-item">
					<view class="activity-icon warning">⚠️</view>
					<view class="activity-content">
						<text class="activity-title">赵六的贷款即将到期</text>
						<text class="activity-time">昨天</text>
					</view>
				</view>
				
				<view class="activity-item">
					<view class="activity-icon info">ℹ️</view>
					<view class="activity-content">
						<text class="activity-title">系统更新了新的贷款产品</text>
						<text class="activity-time">2天前</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		onLoad() {
			
		},
		methods: {
			
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
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
		margin-bottom: 20px;
	}
	
	.stat-card {
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
	
	.chart-container {
		background-color: #fff;
		padding: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
		margin-bottom: 20px;
	}
	
	.chart-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}
	
	.chart-actions {
		display: flex;
	}
	
	.chart-action {
		padding: 4px 8px;
		background-color: #f5f7fa;
		color: #606266;
		border-radius: 4px;
		font-size: 12px;
		margin-left: 5px;
	}
	
	.chart-action.active {
		background-color: #409EFF;
		color: white;
	}
	
	.chart {
		height: 200px;
		background-color: #f5f7fa;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 4px;
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