<template>
	<view class="container">
		<!-- 顶部导航栏 -->
		<view class="navbar">
			<view class="navbar-left" @click="goBack">
				<text class="iconfont icon-back"></text>
			</view>
			<view class="navbar-title">{{ isEdit ? '编辑客户' : '新增客户' }}</view>
			<view class="navbar-right"></view>
		</view>
		
		<!-- 表单内容 -->
		<view class="form-container">
			<view class="form-section">
				<view class="section-title">基本信息</view>
				<view class="form-item">
					<text class="form-label">姓名</text>
					<input class="form-input" v-model="customerForm.name" placeholder="请输入客户姓名" />
				</view>
				<view class="form-item">
					<text class="form-label">手机号</text>
					<input class="form-input" type="number" v-model="customerForm.phone" placeholder="请输入手机号" maxlength="11" />
				</view>
				<view class="form-item">
					<text class="form-label">年龄</text>
					<input class="form-input" type="number" v-model="customerForm.age" placeholder="请输入年龄" />
				</view>
				<view class="form-item">
					<text class="form-label">婚姻状态</text>
					<picker :range="maritalStatusOptions" range-key="label" @change="handleMarriageChange" class="form-picker">
						<view class="picker-value">{{ getMarriageText() }}</view>
					</picker>
				</view>
			</view>
			
			<view class="form-section">
				<view class="section-title">客户资料</view>
				<view class="form-item">
					<text class="form-label">客户分类</text>
					<picker :range="clientTypeOptions" range-key="label" @change="handleClientTypeChange" class="form-picker">
						<view class="picker-value">{{ getClientTypeText() }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="form-label">所属客群</text>
					<picker :range="customerGroupOptions" range-key="label" @change="handleCustomerGroupChange" class="form-picker">
						<view class="picker-value">{{ getCustomerGroupText() }}</view>
					</picker>
				</view>
				<view class="form-item" v-if="customerForm.client_type === 1 || customerForm.client_type === 3">
					<text class="form-label">工作单位</text>
					<input class="form-input" v-model="customerForm.work_unit" placeholder="请输入工作单位" />
				</view>
				<view class="form-item" v-if="customerForm.client_type === 2 || customerForm.client_type === 3">
					<text class="form-label">执照信息</text>
					<input class="form-input" v-model="customerForm.license_info" placeholder="请输入执照信息" />
				</view>
				<view class="form-item" v-if="customerForm.client_type === 2 || customerForm.client_type === 3">
					<text class="form-label">执照图片</text>
					<view class="upload-area">
						<view class="upload-item" v-for="(item, index) in licenseImg" :key="index">
							<image class="upload-image" :src="item" mode="aspectFill" @click="previewImage(item)"></image>
							<text class="delete-icon" @click="deleteImage(index)">×</text>
						</view>
						<view class="upload-add" @click="chooseImage" v-if="licenseImg.length < 5">
							<text class="iconfont icon-add"></text>
						</view>
						<view class="upload-tip">请上传营业执照、法人身份证等相关证件图片（最多5张）</view>
					</view>
				</view>
				<view class="form-item">
					<text class="form-label">资产状况</text>
					<textarea class="form-textarea" v-model="customerForm.asset_info" placeholder="请输入资产状况"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">收入描述</text>
					<textarea class="form-textarea" v-model="customerForm.income" placeholder="请输入收入描述"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">征信描述</text>
					<textarea class="form-textarea" v-model="customerForm.credit_investigation" placeholder="请输入征信描述"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">备注信息</text>
					<textarea class="form-textarea" v-model="customerForm.descr" placeholder="请输入备注信息"></textarea>
				</view>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="btn btn-default" size="small" @click="goBack">取消</button>
			<button class="btn btn-primary" size="small" @click="submitForm">确定</button>
		</view>
	</view>
</template>

<script>
	import customerApi from '@/api/customer.js';
	import { dictMaps, belongingCustomerGroup, maritalStatus, clientTypeOptions } from '@/utils/dict.js';
	
	export default {
		data() {
			return {
				isEdit: false,
				customerId: '',
				customerForm: {
					name: '',
					phone: '',
					age: '',
					matrimony: 1,
					manager: '',
					department: '',
					client_type: 1,
					work_unit: '',
					license_info: '',
					asset_info: '',
					income: '',
					credit_investigation: '',
					descr: '',
					status: 1,
					client_level: ''
				},
				dictMaps: dictMaps,
				maritalStatusOptions: maritalStatus,
				customerGroupOptions: belongingCustomerGroup,
				clientTypeOptions: clientTypeOptions,
				licenseImg: []
			}
		},
		created() {
			this.initDictOptions();
		},
		onLoad(options) {
			console.log('编辑页面接收到的参数:', options);
			if (options.id) {
				this.isEdit = true;
				this.customerId = options.id;
				
				// 检查是否从列表页面传递了客户数据
				if (options.customerData) {
					try {
						// 解析客户数据
						const customerData = JSON.parse(decodeURIComponent(options.customerData));
						console.log('解析后的客户数据:', customerData);
						
						// 将数据映射到表单
						this.customerForm = {
							name: customerData.name || '',
							phone: customerData.phone || '',
							age: customerData.age || '',
							matrimony: customerData.matrimony || 1,
							manager: customerData.service_name || '',
							department: customerData.branch_name || '',
							client_type: customerData.client_type || 1,
							work_unit: customerData.work_unit || '',
							license_info: customerData.license_info || '',
							asset_info: customerData.asset_info || '',
							income: customerData.income || '',
							credit_investigation: customerData.credit_investigation || '',
							descr: customerData.descr || '',
							status: customerData.status || 1
						};
						
						// 处理执照图片 - 如果是字符串，则分割成数组
						if (customerData.license_img) {
							if (typeof customerData.license_img === 'string') {
								this.licenseImg = customerData.license_img.split(',').filter(img => img);
							} else if (Array.isArray(customerData.license_img)) {
								this.licenseImg = customerData.license_img;
							}
							console.log('处理后的执照图片:', this.licenseImg);
						} else {
							this.licenseImg = [];
						}
						
						console.log('已从列表数据加载客户信息');
					} catch (e) {
						console.error('解析客户数据失败', e);
						// 解析失败时调用API获取详情
						this.loadCustomerData();
					}
				} else {
					// 如果没有传递客户数据，则调用API获取
					this.loadCustomerData();
				}
			} else {
				console.log('add')
				let customerForm = uni.getStorageSync('customerForm')
				if (customerForm) {
					this.customerForm = JSON.parse(customerForm)
				}
			}
		},
		methods: {
			initDictOptions() {
				this.maritalStatusOptions = Object.keys(this.dictMaps.maritalStatus).map(key => {
					return {
						value: parseInt(key),
						label: this.dictMaps.maritalStatus[key]
					};
				});
			},
			loadCustomerData() {
				
				// 从API获取客户数据
				customerApi.getDetail(this.customerId)
					.then(res => {
						
						if (res.success && res.retCode === 200 && res.data) {
							const customerData = res.data;
							console.log('API返回的客户数据:', customerData);
							
							this.customerForm = {
								name: customerData.name || '',
								phone: customerData.phone || '',
								age: customerData.age || '',
								matrimony: customerData.matrimony || 1,
								manager: customerData.service_name || '',
								department: customerData.branch_name || '',
								client_type: customerData.client_type || 1,
								work_unit: customerData.work_unit || '',
								license_info: customerData.license_info || '',
								asset_info: customerData.asset_info || '',
								income: customerData.income || '',
								credit_investigation: customerData.credit_investigation || '',
								descr: customerData.descr || '',
								status: customerData.status || 1
							};
							
							// 处理执照图片
							if (customerData.license_img) {
								if (typeof customerData.license_img === 'string') {
									this.licenseImg = customerData.license_img.split(',').filter(img => img);
								} else if (Array.isArray(customerData.license_img)) {
									this.licenseImg = customerData.license_img;
								}
								console.log('API返回的执照图片处理后:', this.licenseImg);
							} else {
								this.licenseImg = [];
							}
						} else {
							uni.showToast({
								title: res.message || '获取客户信息失败',
								icon: 'none',
								duration: 2000,
							});
						}
					})
					.catch(err => {
						uni.showToast({
							title: err.message,
							icon: 'none',
							duration: 2000,
						});
						console.error('获取客户信息失败', err);
					});
			},
			handleMarriageChange(e) {
				const index = e.detail.value;
				this.customerForm.matrimony = this.maritalStatusOptions[index].value;
			},
			getMarriageText() {
				const status = this.customerForm.matrimony;
				const found = this.maritalStatusOptions.find(item => item.value === status);
				return found ? found.label : '请选择婚姻状态';
			},
			handleCustomerGroupChange(e) {
				const index = e.detail.value;
				this.customerForm.client_type = this.customerGroupOptions[index].value;
			},
			getCustomerGroupText() {
				const group = this.customerForm.client_type;
				const found = this.customerGroupOptions.find(item => item.value === group);
				return found ? found.label : '请选择客群';
			},

			handleClientTypeChange (e) {
				const index = e.detail.value;
				this.customerForm.client_level = this.clientTypeOptions[index].value;
			},
			getClientTypeText () {
				const group = this.customerForm.client_level;
				const found = this.clientTypeOptions.find(item => item.value === group);
				return found ? found.label : '请选择客户分类';
			},
			chooseImage() {
				uni.setStorageSync('isChoosingImage', true);
				uni.chooseImage({
					count: 5 - this.licenseImg.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.licenseImg = [...this.licenseImg, ...res.tempFilePaths];
					}
				});
			},
			deleteImage(index) {
				this.licenseImg.splice(index, 1);
			},
			previewImage(current) {
				uni.setStorageSync('isChoosingImage', true);
				uni.previewImage({
					urls: this.licenseImg,
					current: current
				});
			},
			validateForm() {
				if (!this.customerForm.name) {
					uni.showToast({
						title: '请输入客户姓名',
						icon: 'none',
						duration: 2000,
					});
					return false;
				}
				if (!this.customerForm.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none',
						duration: 2000,
					});
					return false;
				}
				if (!/^1\d{10}$/.test(this.customerForm.phone)) {
					uni.showToast({
						title: '请输入正确的手机号格式',
						icon: 'none',
						duration: 2000,
					});
					return false;
				}
				return true;
			},
			submitForm() {
				if (!this.validateForm()) {
					return;
				}
				
				// uni.showLoading({
				// 	title: '提交中...'
				// });
				
				const formData = {
					id: this.isEdit ? this.customerId : '',
					name: this.customerForm.name,
					phone: this.customerForm.phone,
					age: this.customerForm.age,
					matrimony: this.customerForm.matrimony,
					branch_name: this.customerForm.department,
					client_type: this.customerForm.client_type,
					work_unit: this.customerForm.work_unit || '',
					license_info: this.customerForm.license_info || '',
					income: this.customerForm.income || '',
					credit_investigation: this.customerForm.credit_investigation || '',
					asset_info: this.customerForm.asset_info || '',
					descr: this.customerForm.descr || '',
					client_level: this.customerForm.client_level || '',
					status: 1,
				};
				
				const uploadImages = () => {
					// 如果没有图片，直接提交表单
					if (this.licenseImg.length === 0) {
						formData.license_img = '';
						this.submitToServer(formData);
						return;
					}
					
					let uploadedCount = 0;
					let uploadedImages = [];
					
					// 逐个上传图片
					this.licenseImg.forEach((path, index) => {
						// 如果图片路径已经是网络URL，直接添加到上传列表
						if (path.startsWith('http')) {
							uploadedCount++;
							uploadedImages.push(path);
							
							// 所有图片处理完毕后提交表单
							if (uploadedCount === this.licenseImg.length) {
								// 将图片路径数组转换为逗号分隔的字符串
								formData.license_img = uploadedImages.join(',');
								this.submitToServer(formData);
							}
							return;
						}
						
						// 否则上传新图片
						uni.uploadFile({
							url: '/doc/upload',
							filePath: path,
							name: 'file',
							success: (res) => {
								try {
									const response = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
									if (response.success && response.retCode === 200) {
										uploadedImages.push(response.data);
									} else {
										uni.showToast({
											title: response.message || '图片上传失败',
											icon: 'none',
											duration: 2000,
										});
									}
								} catch (e) {
									console.error('解析上传响应失败', e);
									uni.showToast({
										title: '图片上传失败',
										icon: 'none',
										duration: 2000,
									});
								}
							},
							fail: (err) => {
								console.error('图片上传请求失败', err);
								uni.showToast({
									title: '图片上传失败',
									icon: 'none',
									duration: 2000,
								});
							},
							complete: () => {
								uploadedCount++;
								
								// 所有图片处理完毕后提交表单
								if (uploadedCount === this.licenseImg.length) {
									// 将图片路径数组转换为逗号分隔的字符串
									formData.license_img = uploadedImages.join(',');
									this.submitToServer(formData);
								}
							}
						});
					});
				};
				
				uploadImages();
			},
			
			submitToServer(formData) {
				const apiCall = this.isEdit ? 
					customerApi.update(formData) : 
					customerApi.add(formData);
					
				apiCall.then(res => {
					// uni.hideLoading();
					
					if (res.success && res.retCode === 200) {
						uni.showToast({
							title: this.isEdit ? '客户信息更新成功' : '客户添加成功',
							icon: 'success',
							duration: 2000,
						});
						uni.removeStorageSync('customerForm')
						setTimeout(() => {
							uni.navigateBack();
						}, 1500);
					} else {
						uni.showToast({
							title: res.message || '提交失败',
							icon: 'none',
							duration: 2000,
						});
						// uni.hideLoading();
					}
				}).catch(err => {
					// uni.hideLoading();
					uni.showToast({
						title: err.message,
						icon: 'none',
						duration: 2000,
					});
					console.error(err);
				});
			},
			
			goBack() {
				uni.setStorageSync('customerForm', JSON.stringify(this.customerForm))
				uni.navigateBack();
			}
		}
	}
</script>

<style>
	.container {
		height: 100vh;
		background-color: #f5f7fa;
		display: flex;
		flex-direction: column;
	}
	
	.navbar {
		display: flex;
		height: 90rpx;
		padding: 90rpx 30rpx 0;
		justify-content: space-between;
		align-items: center;
		background-color: #409EFF;
		color: #FFFFFF;
		position: relative;
	}
	
	.navbar-left {
		width: 80rpx;
		display: flex;
		align-items: center;
	}
	
	.icon-back {
		font-size: 36rpx;
	}
	
	.navbar-title {
		font-size: 24rpx;
		font-weight: 400;
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.navbar-right {
		width: 80rpx;
	}
	
	.form-container {
		height: calc(100vh - 176rpx);
		padding: 20rpx 30rpx;
		overflow-y: auto;
	}
	
	.form-section {
		background-color: #FFFFFF;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: 500;
		color: #333;
		padding: 20rpx 0;
		padding-left: 20rpx;
		border-bottom: 1px solid #ebeef5;
		margin-bottom: 20rpx;
		position: relative;
	}
	
	.section-title:before {
		content: "";
		position: absolute;
		left: 0;
		top: 24rpx;
		height: 32rpx;
		width: 6rpx;
		background-color: #409EFF;
		border-radius: 3rpx;
	}
	
	.form-item {
		margin-bottom: 20rpx;
	}
	
	.form-label {
		display: block;
		font-size: 28rpx;
		color: #606266;
		margin-bottom: 10rpx;
	}
	
	.form-input {
		width: 100%;
		height: 80rpx;
		border: 1px solid #dcdfe6;
		border-radius: 4rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		box-sizing: border-box;
	}
	
	.form-textarea {
		width: 100%;
		height: 160rpx;
		border: 1px solid #dcdfe6;
		border-radius: 4rpx;
		padding: 20rpx;
		font-size: 28rpx;
		color: #333;
		background-color: #fff;
		box-sizing: border-box;
	}
	
	.form-picker {
		width: 100%;
		height: 80rpx;
		border: 1px solid #dcdfe6;
		border-radius: 4rpx;
		font-size: 28rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		box-sizing: border-box;
	}
	
	.picker-value {
		color: #333;
	}
	
	.upload-area {
		display: flex;
		flex-wrap: wrap;
		margin-top: 10rpx;
	}
	
	.upload-item {
		width: 160rpx;
		height: 160rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
	}
	
	.upload-image {
		width: 100%;
		height: 100%;
		border-radius: 8rpx;
	}
	
	.delete-icon {
		position: absolute;
		right: -10rpx;
		top: -10rpx;
		width: 40rpx;
		height: 40rpx;
		background-color: #f56c6c;
		color: #fff;
		border-radius: 50%;
		text-align: center;
		line-height: 34rpx;
		font-size: 28rpx;
	}
	
	.upload-add {
		width: 160rpx;
		height: 160rpx;
		background-color: #f5f7fa;
		border: 1px dashed #d9d9d9;
		border-radius: 8rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.upload-add .iconfont {
		font-size: 60rpx;
		color: #c0c4cc;
	}
	
	.upload-tip {
		width: 100%;
		font-size: 24rpx;
		color: #909399;
		margin-top: 10rpx;
	}
	
	.footer {
		display: flex;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #fff;
		border-top: 1px solid #ebeef5;
	}
	
	.btn {
		flex: 1;
		text-align: center;
		border-radius: 8rpx;
		font-size: 28rpx;
	}
	
	.btn-default {
		background-color: #f2f6fc;
		color: #606266;
		margin-right: 20rpx;
	}
	
	.btn-primary {
		background-color: #409EFF;
		color: #fff;
	}
</style>