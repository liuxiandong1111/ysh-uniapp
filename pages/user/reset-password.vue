<template>
	<view class="container">
		
		<view class="form-container">
			
			<view class="form-item">
				<text class="form-label">新密码</text>
				<input type="password" v-model="formData.newPassword" placeholder="请输入新密码" class="form-input" />
			</view>
			
			<view class="form-item">
				<text class="form-label">确认密码</text>
				<input type="password" v-model="formData.confirmPassword" placeholder="请再次输入新密码" class="form-input" />
			</view>
			
			<button class="submit-button" @click="submitForm">确认修改</button>
		</view>
	</view>
</template>

<script>
	import userApi from '../../api/user.js';
	
	export default {
		data() {
			return {
				formData: {
					oldPassword: '',
					newPassword: '',
					confirmPassword: ''
				},
				errors: {}
			}
		},
		methods: {
			// 返回上一页
			goBack() {
				uni.navigateBack();
			},
			
			// 验证表单
			validateForm() {
				this.errors = {};
				let isValid = true;
				
				
				// 验证新密码
				if (!this.formData.newPassword) {
					this.errors.newPassword = '请输入新密码';
					isValid = false;
				} else if (this.formData.newPassword.length < 6) {
					this.errors.newPassword = '6';
					isValid = false;
				} else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(this.formData.newPassword)) {
					this.errors.newPassword = '密码必须包含字母和数字';
					isValid = false;
				}
				
				// 验证确认密码
				if (!this.formData.confirmPassword) {
					this.errors.confirmPassword = '请确认新密码';
					isValid = false;
				} else if (this.formData.confirmPassword !== this.formData.newPassword) {
					this.errors.confirmPassword = '两次输入的密码不一致';
					isValid = false;
				}
				
				return isValid;
			},
			
			// 提交表单
			async submitForm() {
				if (!this.validateForm()) {
					// 显示第一个错误
					const firstError = Object.values(this.errors)[0];
					uni.showToast({
						title: firstError,
						icon: 'none'
					});
					return;
				}
				
				try {
					uni.showLoading({
						title: '提交中...'
					});
					
					const res = await userApi.resetPassword({
						uid: uni.getStorageSync('userInfo').id,
						password: this.formData.newPassword
					});
					
					if (res.retCode == 200) {
						uni.showToast({
							title: '密码修改成功',
							icon: 'success'
						});
						
						// 清除登录状态，返回登录页
						setTimeout(() => {
							uni.clearStorageSync();
							uni.reLaunch({
								url: '/pages/login/login'
							});
						}, 1500);
					} else {
						uni.showToast({
							title: res.message || '密码修改失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('密码修改失败', error);
					uni.showToast({
						title: error.message,
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
	
	.back-button {
		width: 30px;
		height: 30px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.header-title {
		font-size: 18px;
		font-weight: bold;
	}
	
	.form-container {
		padding: 20px;
		background-color: #fff;
		margin: 15px;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0,0,0,0.1);
	}
	
	.form-item {
		margin-bottom: 20px;
	}
	
	.form-label {
		display: block;
		margin-bottom: 8px;
		font-size: 16px;
		color: #303133;
	}
	
	.form-input {
		width: 100%;
		height: 40px;
		padding: 0 10px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		box-sizing: border-box;
	}
	
	.form-tips {
		margin: 20px 0;
		padding: 10px;
		background-color: #f0f9eb;
		border-radius: 4px;
		color: #67c23a;
		font-size: 14px;
	}
	
	.form-tips text {
		display: block;
		margin-bottom: 5px;
	}
	
	.submit-button {
		width: 100%;
		height: 44px;
		background-color: #409EFF;
		color: white;
		border-radius: 4px;
		font-size: 16px;
		margin-top: 20px;
	}
</style>