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
					<picker :range="maritalStatus" range-key="label" @change="handleMarriageChange" class="form-picker">
						<view class="picker-value">{{ getMarriageText() }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="form-label">业务负责人</text>
					<input class="form-input" v-model="customerForm.manager" placeholder="请输入业务负责人" />
				</view>
				<view class="form-item">
					<text class="form-label">所属部门</text>
					<picker :range="departmentOptions" @change="handleDepartmentChange" class="form-picker">
						<view class="picker-value">{{ customerForm.department || '请选择部门' }}</view>
					</picker>
				</view>
			</view>
			
			<view class="form-section">
				<view class="section-title">客户资料</view>
				<view class="form-item">
					<text class="form-label">所属客群</text>
					<picker :range="customerGroupOptions" range-key="label" @change="handleCustomerGroupChange" class="form-picker">
						<view class="picker-value">{{ getCustomerGroupText() }}</view>
					</picker>
				</view>
				<view class="form-item">
					<text class="form-label">工作单位</text>
					<input class="form-input" v-model="customerForm.workplace" placeholder="请输入工作单位" />
				</view>
				<view class="form-item" v-if="customerForm.customerGroup === '经营'">
					<text class="form-label">执照信息</text>
					<input class="form-input" v-model="customerForm.licenseInfo" placeholder="请输入执照信息" />
				</view>
				<view class="form-item" v-if="customerForm.customerGroup === '经营'">
					<text class="form-label">执照图片</text>
					<view class="upload-area">
						<view class="upload-item" v-for="(item, index) in licenseImages" :key="index">
							<image class="upload-image" :src="item" mode="aspectFill" @click="previewImage(item)"></image>
							<text class="delete-icon" @click="deleteImage(index)">×</text>
						</view>
						<view class="upload-add" @click="chooseImage" v-if="licenseImages.length < 5">
							<text class="iconfont icon-add"></text>
						</view>
						<view class="upload-tip">请上传营业执照、法人身份证等相关证件图片（最多5张）</view>
					</view>
				</view>
				<view class="form-item">
					<text class="form-label">资产状况</text>
					<textarea class="form-textarea" v-model="customerForm.assets" placeholder="请输入资产状况"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">收入描述</text>
					<textarea class="form-textarea" v-model="customerForm.income" placeholder="请输入收入描述"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">征信描述</text>
					<textarea class="form-textarea" v-model="customerForm.creditDescription" placeholder="请输入征信描述"></textarea>
				</view>
				<view class="form-item">
					<text class="form-label">备注信息</text>
					<textarea class="form-textarea" v-model="customerForm.remarks" placeholder="请输入备注信息"></textarea>
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
	export default {
		data() {
			return {
				isEdit: false,
				customerId: '',
				customerForm: {
					name: '',
					phone: '',
					age: '',
					marriageStatus: 'single',
					manager: '',
					department: '',
					customerGroup: '消费',
					workplace: '',
					licenseInfo: '',
					licenseImages: [],
					assets: '',
					income: '',
					creditDescription: '',
					remarks: '',
					status: 'new'
				},
				maritalStatus: [
					{ value: 'single', label: '未婚' },
					{ value: 'married', label: '已婚' },
					{ value: 'divorced', label: '离异' },
					{ value: 'widowed', label: '丧偶' }
				],
				departmentOptions: ['消费信贷部', '小微信贷部'],
				customerGroupOptions: [
					{ value: '消费', label: '消费' },
					{ value: '经营', label: '经营' }
				],
				licenseImages: []
			}
		},
		onLoad(options) {
			if (options.id) {
				this.isEdit = true;
				this.customerId = options.id;
				this.loadCustomerData();
			}
		},
		methods: {
			loadCustomerData() {
				// 模拟从API获取客户数据
				setTimeout(() => {
					// 如果是编辑模式，获取客户数据
					if (this.isEdit) {
						// 模拟数据
						if (this.customerId === '1') {
							this.customerForm = {
								name: '张三',
								phone: '13800138000',
								age: 35,
								marriageStatus: 'married',
								manager: '王经理',
								department: '消费信贷部',
								customerGroup: '消费',
								workplace: '北京科技有限公司',
								licenseInfo: '',
								licenseImages: [],
								assets: '房产一套，车辆一台',
								income: '20000元/月',
								creditDescription: '信用良好，无逾期',
								remarks: '客户对产品很感兴趣',
								status: 'intention'
							};
						} else if (this.customerId === '2') {
							this.customerForm = {
								name: '李四',
								phone: '13800138001',
								age: 42,
								marriageStatus: 'married',
								manager: '赵经理',
								department: '小微信贷部',
								customerGroup: '经营',
								workplace: '',
								licenseInfo: '北京食品贸易有限公司',
								licenseImages: ['https://example.com/license1.jpg'],
								assets: '商铺两间，车辆一台',
								income: '50000元/月',
								creditDescription: '信用优良，历史贷款按时还款',
								remarks: '老客户，已多次合作',
								status: 'deal'
							};
							// 将远程图片URL转换为本地展示数据
							this.licenseImages = this.customerForm.licenseImages;
						}
					}
				}, 500);
				
				// 实际项目中使用API调用
				// uni.request({
				//   url: 'your_api_endpoint/customer/' + this.customerId,
				//   method: 'GET',
				//   success: (res) => {
				//     this.customerForm = res.data;
				//     this.licenseImages = this.customerForm.licenseImages || [];
				//   },
				//   fail: () => {
				//     uni.showToast({
				//       title: '获取客户数据失败',
				//       icon: 'none'
				//     });
				//   }
				// });
			},
			handleMarriageChange(e) {
				const index = e.detail.value;
				this.customerForm.marriageStatus = this.maritalStatus[index].value;
			},
			getMarriageText() {
				const status = this.customerForm.marriageStatus;
				const found = this.maritalStatus.find(item => item.value === status);
				return found ? found.label : '请选择婚姻状态';
			},
			handleDepartmentChange(e) {
				const index = e.detail.value;
				this.customerForm.department = this.departmentOptions[index];
			},
			handleCustomerGroupChange(e) {
				const index = e.detail.value;
				this.customerForm.customerGroup = this.customerGroupOptions[index].value;
			},
			getCustomerGroupText() {
				const group = this.customerForm.customerGroup;
				const found = this.customerGroupOptions.find(item => item.value === group);
				return found ? found.label : '请选择客群';
			},
			chooseImage() {
				uni.chooseImage({
					count: 5 - this.licenseImages.length,
					sizeType: ['compressed'],
					sourceType: ['album', 'camera'],
					success: (res) => {
						this.licenseImages = [...this.licenseImages, ...res.tempFilePaths];
					}
				});
			},
			deleteImage(index) {
				this.licenseImages.splice(index, 1);
			},
			previewImage(current) {
				uni.previewImage({
					urls: this.licenseImages,
					current: current
				});
			},
			validateForm() {
				if (!this.customerForm.name) {
					uni.showToast({
						title: '请输入客户姓名',
						icon: 'none'
					});
					return false;
				}
				if (!this.customerForm.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					});
					return false;
				}
				if (!/^1\d{10}$/.test(this.customerForm.phone)) {
					uni.showToast({
						title: '请输入正确的手机号格式',
						icon: 'none'
					});
					return false;
				}
				if (!this.customerForm.department) {
					uni.showToast({
						title: '请选择所属部门',
						icon: 'none'
					});
					return false;
				}
				return true;
			},
			submitForm() {
				if (!this.validateForm()) {
					return;
				}
				
				// 准备提交的数据
				const formData = {
					...this.customerForm,
					licenseImages: this.licenseImages
				};
				
				// 模拟提交到API
				uni.showLoading({
					title: '提交中...'
				});
				
				setTimeout(() => {
					uni.hideLoading();
					uni.showToast({
						title: this.isEdit ? '客户信息更新成功' : '客户添加成功',
						icon: 'success'
					});
					
					// 返回上一页
					setTimeout(() => {
						uni.navigateBack();
					}, 1500);
				}, 1000);
				
				// 实际项目中使用API调用
				// const url = this.isEdit 
				//   ? 'your_api_endpoint/customer/' + this.customerId
				//   : 'your_api_endpoint/customer';
				// const method = this.isEdit ? 'PUT' : 'POST';
				
				// uni.request({
				//   url: url,
				//   method: method,
				//   data: formData,
				//   success: (res) => {
				//     uni.showToast({
				//       title: this.isEdit ? '客户信息更新成功' : '客户添加成功',
				//       icon: 'success'
				//     });
				//     setTimeout(() => {
				//       uni.navigateBack();
				//     }, 1500);
				//   },
				//   fail: (err) => {
				//     uni.showToast({
				//       title: '提交失败，请重试',
				//       icon: 'none'
				//     });
				//   },
				//   complete: () => {
				//     uni.hideLoading();
				//   }
				// });
			},
			goBack() {
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