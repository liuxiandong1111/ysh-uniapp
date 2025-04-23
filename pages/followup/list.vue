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
		onLoad(options) {
			// 自动重定向到followup页面，并保留所有参数
			let url = '/pages/followup/followup';
			
			// 添加所有参数
			if (options) {
				const params = Object.keys(options).map(key => {
					// 如果是customerId参数，重命名为id
					if (key === 'customerId') {
						return `id=${options[key]}`;
					}
					return `${key}=${options[key]}`;
				});
				
				if (params.length > 0) {
					url += '?' + params.join('&');
				}
			}
			
			uni.redirectTo({ url });
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