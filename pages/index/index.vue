<template>
	<view class="container">
		<view class="loading">加载中...</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		},
		onLoad() {
			// 自动重定向到登录页
			uni.redirectTo({
				url: '/pages/customer/customer'
			});
		}
	}
</script>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	
	.loading {
		font-size: 16px;
		color: #999;
	}
</style>
