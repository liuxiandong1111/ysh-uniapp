<template>
	<view class="container">
		<view class="login-container">
			<view class="header">
				<view class="logo">元</view>
				<text class="title">元圣行管理系统</text>
			</view>
			
			<view class="form">
				<view class="form-group">
					<view class="form-icon">📱</view>
					<input type="text" class="form-control" placeholder="请输入手机号" v-model="phone" />
					<text v-if="errors.phone" class="error-message">请输入正确的手机号</text>
				</view>
				
				<view class="form-group">
					<view class="form-icon">🔒</view>
					<input type="password" class="form-control" placeholder="请输入密码" v-model="password" />
					<text v-if="errors.password" class="error-message">请输入密码</text>
				</view>
				
				<button type="primary" class="login-btn" @click="handleLogin">登 录</button>
			</view>
		</view>
		
		<view class="footer">
			© 2024 元圣行管理系统
		</view>
	</view>
</template>

<script>
	import userApi from '@/api/user.js';
	
	export default {
		data() {
			return {
				phone: '',
				password: '',
				errors: {
					phone: false,
					password: false
				}
			}
		},
		methods: {
			validateForm() {
				let isValid = true;
				
				// 验证手机号
				if (!this.phone || !/^1[3-9]\d{9}$/.test(this.phone)) {
					this.errors.phone = true;
					isValid = false;
				} else {
					this.errors.phone = false;
				}
				
				// 验证密码
				if (!this.password) {
					this.errors.password = true;
					isValid = false;
				} else {
					this.errors.password = false;
				}
				
				return isValid;
			},
			handleLogin() {
				if (this.validateForm()) {
					// 调用登录API
					userApi.login({
						phone: this.phone,
						password: this.password
					}).then(res => {
						console.log('登录成功', res);
						
						// 根据实际返回结构处理登录结果
						if (res.success && res.retCode === 200 && res.data) {
							// 存储登录状态和token
							uni.setStorageSync('isLoggedIn', true);
							uni.setStorageSync('token', res.data.token);
							uni.setStorageSync('userInfo', res.data);
							
							// 登录成功后跳转到主页
							uni.switchTab({
								url: '/pages/dashboard/dashboard'
							});
						} else {
							uni.showToast({
								title: res.message || '登录失败',
								icon: 'none',
								duration: 2000
							});
						}
					}).catch(err => {
						console.error('登录失败', err);
						uni.showToast({
							title: err.message || '登录失败，请检查账号密码',
							icon: 'none',
							duration: 2000
						});
					});
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
		background-image: linear-gradient(45deg, rgba(240,242,245,0.4) 25%, transparent 25%, transparent 50%, rgba(240,242,245,0.4) 50%, rgba(240,242,245,0.4) 75%, transparent 75%, transparent);
		background-size: 20px 20px;
	}
	
	.login-container {
		width: 90%;
		max-width: 350px;
		margin: 0 auto;
		padding: 30px 20px;
		background-color: rgba(255, 255, 255, 0.9);
		border-radius: 10px;
		margin-top: 80px;
		box-shadow: 0 5px 15px rgba(0,0,0,0.1);
	}
	
	.header {
		text-align: center;
		margin-bottom: 40px;
	}
	
	.logo {
		width: 80px;
		height: 80px;
		margin: 0 auto 20px;
		background-color: #409EFF;
		border-radius: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: white;
		font-size: 30px;
		font-weight: bold;
	}
	
	.title {
		color: #333;
		font-size: 24px;
	}
	
	.form-group {
		margin-bottom: 20px;
		position: relative;
	}
	
	.form-control {
		padding: 12px 15px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		font-size: 16px;
		transition: border-color 0.3s;
		padding-left: 40px;
	}
	
	.form-icon {
		position: absolute;
		left: 15px;
		top: 13px;
		color: #909399;
		font-size: 16px;
		z-index: 1;
	}
	
	.error-message {
		color: #F56C6C;
		font-size: 12px;
		margin-top: 5px;
		display: block;
	}
	
	.login-btn {
		background-color: #409EFF;
		color: white;
		width: 100%;
		padding: 12px;
		border: none;
		border-radius: 4px;
		font-size: 16px;
		font-weight: bold;
		margin-top: 10px;
	}
	
	.footer {
		margin-top: auto;
		text-align: center;
		font-size: 14px;
		color: #909399;
		padding: 20px 0;
	}
</style> 