<template>
	<view class="container">
		<view class="form-card">
			<view class="form-title">逾期处理</view>
			
			<view class="form-group">
				<view class="form-label">处理结果</view>
				<view class="radio-group">
					<view class="radio-item" :class="{ active: overdueForm.action == 0 }" @click="selectAction(0)">
						<view class="radio-dot" :class="{ checked: overdueForm.action == 0 }"></view>
						<text class="radio-text">正常</text>
					</view>
					<view class="radio-item" :class="{ active: overdueForm.action == 1 }" @click="selectAction(1)">
						<view class="radio-dot" :class="{ checked: overdueForm.action == 1 }"></view>
						<text class="radio-text">逾期</text>
					</view>
				</view>
			</view>
			
			<view class="form-group" v-if="overdueForm.action == 1">
				<view class="form-label">处理说明</view>
				<textarea class="form-textarea" v-model="overdueForm.desc" placeholder="请输入处理说明" />
			</view>
			
			<view class="form-buttons">
				<button class="btn-cancel" @click="cancel">取消</button>
				<button class="btn-submit" @click="submit">提交</button>
			</view>
		</view>
	</view>
</template>

<script>
import financeApi from '@/api/finance.js';
	export default {
		data() {
			return {
				loanId: null,
				loanInfo: null,
				overdueForm: {
					action: 0,
          desc: ''
				}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.loanId = options.id;
				this.loadLoanInfo();
			}
		},
		methods: {
			// 加载贷款信息
			loadLoanInfo() {
				// 模拟获取贷款信息
				// 实际项目中应该调用API获取
				this.loanInfo = {
					id: this.loanId,
					name: '个人消费贷款',
					amount: '50,000元',
					status: '已逾期',
					overdueDays: 15
				};
			},
			
			// 选择处理结果
			selectAction(action) {
				this.overdueForm.action = action;
			},
			
			// 取消操作
			cancel() {
				uni.navigateBack();
			},
			
			// 提交处理结果
			submit() {
				if (this.overdueForm.action == 1 && !this.overdueForm.desc) {
					uni.showToast({
						title: '请输入处理说明',
						icon: 'none'
					});
					return;
				}
				
				// 模拟提交到服务器
				// 实际项目中应该调用API提交
				uni.showLoading({
					title: '提交中...'
				});

        const params = {
          id: this.loanId,
          is_yu: this.overdueForm.action,
          yu_desc: this.overdueForm.desc
        }

        financeApi.financeSaveLoan(params).then(res => {
          if (res.retCode == 200) {
            uni.showToast({
              title: res.message,
              icon: 'success',
              duration: 1500
            });

            // 提交成功后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1500);
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 1500
            });
          }
        }).finally(() => {
          uni.hideLoading();
        })
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 15px;
	}
	
	.form-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.form-title {
		font-size: 18px;
		font-weight: bold;
		color: #303133;
		margin-bottom: 20px;
		position: relative;
		padding-left: 12px;
	}
	
	.form-title::before {
		content: '';
		position: absolute;
		left: 0;
		top: 4px;
		width: 4px;
		height: 16px;
		background-color: #409EFF;
		border-radius: 2px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-label {
		font-size: 15px;
		color: #606266;
		margin-bottom: 10px;
	}
	
	.radio-group {
		display: flex;
		margin-bottom: 10px;
	}
	
	.radio-item {
		display: flex;
		align-items: center;
		margin-right: 20px;
		padding: 8px 12px;
		border-radius: 4px;
	}

	
	.radio-dot {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #dcdfe6;
		margin-right: 8px;
		position: relative;
	}
	
	.radio-dot.checked {
		border-color: #409EFF;
	}
	
	.radio-dot.checked::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background-color: #409EFF;
	}
	
	.radio-text {
		font-size: 14px;
		color: #606266;
	}
	
	.form-textarea {
		width: 100%;
		height: 120px;
		padding: 10px;
		font-size: 14px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #fff;
	}
	
	.form-buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 30px;
	}
	
	.btn-cancel {
		background-color: #f5f7fa;
		color: #606266;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		font-size: 14px;
		margin-right: 15px;
	}
	
	.btn-submit {
		background-color: #409EFF;
		color: white;
		border: none;
		border-radius: 4px;
		font-size: 14px;
	}
</style> 