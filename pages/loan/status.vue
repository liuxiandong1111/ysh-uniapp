<template>
	<view class="container">
		<view class="form-card">
			<view class="form-title">更新贷款进度</view>
			
			<view class="form-group">
				<view class="form-label">审批状态</view>
				<view class="status-picker" @click="showStatusPicker = true">
					<text class="picker-value">{{ updateStatusForm.statusLabel || '请选择贷款进度' }}</text>
					<text class="picker-arrow">▼</text>
				</view>
			</view>
			
			<view class="form-group" v-if="updateStatusForm.status == '3'">
				<view class="form-label">拒绝原因</view>
				<input class="form-input" type="text" v-model="updateStatusForm.cause" placeholder="请输入拒绝原因" />
			</view>
			
			<view class="form-group" v-if="updateStatusForm.status == '2'">
				<view class="form-label">放款时间</view>
				<picker mode="date" :value="updateStatusForm.loan_date" @change="onDateChange" class="date-input">
					<view class="date-display">
						<text class="picker-value">{{ updateStatusForm.loan_date || '请选择放款时间' }}</text>
						<text class="picker-arrow">▼</text>
					</view>
				</picker>
			</view>
			
			<view class="form-buttons">
				<button class="btn-cancel" @click="cancel">取消</button>
				<button class="btn-submit" @click="submit">提交</button>
			</view>
		</view>
		
		<!-- 状态选择器弹窗 -->
		<view class="mask" v-if="showStatusPicker" @click="showStatusPicker = false">
			<view class="picker-panel" @click.stop>
				<view class="picker-header">
					<text class="picker-title">选择贷款进度</text>
					<text class="picker-close" @click="showStatusPicker = false">×</text>
				</view>
				<view class="picker-options">
					<view class="picker-option" 
						v-for="(option, index) in statusOptions" 
						:key="index" 
						@click="selectStatus(option)">
						<text class="option-text" :class="{ active: updateStatusForm.status === option.value }">{{ option.label }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { approvalStatus } from '@/utils/dict.js';
  import financeApi from '@/api/finance.js';
	export default {
		data() {
			return {
				loanId: null,
				loanInfo: null,
				showStatusPicker: false,
				statusOptions: approvalStatus,
				updateStatusForm: {
					status: '',
					statusLabel: '',
					cause: '',
					loan_date: ''
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
					status: '审批中'
				};
			},
			
			// 选择状态
			selectStatus(option) {
				this.updateStatusForm.status = option.value;
				this.updateStatusForm.statusLabel = option.label;
				this.showStatusPicker = false;
			},
			
			// 日期变更
			onDateChange(e) {
				this.updateStatusForm.loan_date = e.detail.value;
			},
			
			// 取消操作
			cancel() {
				uni.navigateBack();
			},
			
			// 提交处理结果
			submit() {
				// 表单验证
				if (!this.updateStatusForm.status) {
					uni.showToast({
						title: '请选择审批状态',
						icon: 'none'
					});
					return;
				}
				
				if (this.updateStatusForm.status == '3' && !this.updateStatusForm.cause) {
					uni.showToast({
						title: '请输入拒绝原因',
						icon: 'none'
					});
					return;
				}
				
				if (this.updateStatusForm.status == '2' && !this.updateStatusForm.loan_date) {
					uni.showToast({
						title: '请选择放款时间',
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
          status: this.updateStatusForm.status
        }

        if (this.updateStatusForm.status == 2) {
          params.loan_date = this.updateStatusForm.loan_date || new Date().toISOString().split('T')[0]
        } else if (this.updateStatusForm.status == 3) {
          params.cause = this.updateStatusForm.cause
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
	
	.status-picker, .date-display {
		height: 40px;
		line-height: 40px;
		padding: 0 12px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #fff;
	}
	
	.date-input {
		width: 100%;
	}
	
	.picker-value {
		font-size: 14px;
		color: #606266;
	}
	
	.picker-arrow {
		font-size: 12px;
		color: #c0c4cc;
	}
	
	.form-input {
		height: 40px;
		padding: 0 12px;
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
	
	/* 弹窗样式 */
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 999;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.picker-panel {
		width: 80%;
		background-color: #fff;
		border-radius: 8px;
		overflow: hidden;
	}
	
	.picker-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 12px 15px;
		border-bottom: 1px solid #ebeef5;
	}
	
	.picker-title {
		font-size: 16px;
		font-weight: bold;
		color: #303133;
	}
	
	.picker-close {
		font-size: 20px;
		color: #909399;
		padding: 5px;
	}
	
	.picker-options {
		padding: 10px 0;
		max-height: 300px;
		overflow-y: auto;
	}
	
	.picker-option {
		padding: 12px 15px;
	}
	
	.option-text {
		font-size: 14px;
		color: #606266;
	}
	
	.option-text.active {
		color: #409EFF;
	}
</style> 