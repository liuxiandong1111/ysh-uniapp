<template>
	<view class="container">
		<view class="form-card">
			<view class="form-title">{{ isEdit ? '编辑贷款申请' : '创建贷款申请' }}</view>
			
			<view class="form-section">
				<view class="section-title">客户信息</view>
				<view class="form-group">
					<view class="form-label">客户姓名</view>
					<view class="form-value">{{ customerData.name }}</view>
				</view>
				
				<view class="form-group">
					<view class="form-label">客户类型</view>
					<view class="form-value">{{ getClientType(customerData.client_type) }}</view>
				</view>
			</view>
			
			<view class="form-section">
				<view class="section-title">贷款信息</view>
				<view class="form-group">
					<view class="form-label">贷款名称</view>
					<input class="form-input" type="text" v-model="loanForm.name" placeholder="请输入贷款名称" />
				</view>
				
				<view class="form-group">
					<view class="form-label">贷款类型</view>
					<picker mode="selector" :range="loanTypes" range-key="label" @change="onLoanTypeChange" class="picker-input">
						<view class="picker-display">
							<text class="picker-value">{{ loanForm.typeLabel || '请选择贷款类型' }}</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
				</view>
				
				<view class="form-group">
					<view class="form-label">贷款期限</view>
					<picker mode="selector" :range="loanTerms" range-key="label" @change="onLoanTermChange" class="picker-input">
						<view class="picker-display">
							<text class="picker-value">{{ loanForm.age_limitLabel || '请选择贷款期限' }}</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
				</view>
				
				<view class="form-group">
					<view class="form-label">还款方式</view>
					<picker mode="selector" :range="repaymentMethods" range-key="label" @change="onRepaymentMethodChange" class="picker-input">
						<view class="picker-display">
							<text class="picker-value">{{ loanForm.due_typeLabel || '请选择还款方式' }}</text>
							<text class="picker-arrow">▼</text>
						</view>
					</picker>
				</view>

				<view class="form-group">
					<view class="form-label">额度</view>
					<input class="form-input" type="number" v-model="loanForm.quota" placeholder="请输入额度" />
				</view>

				<view class="form-group">
					<view class="form-label">利率</view>
					<input class="form-input" type="number" v-model="loanForm.rate" placeholder="请输入利率" />
				</view>
				
				<view class="form-group" v-if="hasPermission">
					<view class="form-label">渠道</view>
					<input class="form-input" type="text" v-model="loanForm.channel" placeholder="请输入渠道" />
				</view>
			</view>
			
			<view class="form-buttons">
				<button class="btn-cancel" @click="cancel">取消</button>
				<button class="btn-submit" @click="submit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { belongingCustomerGroup, loanTerm, repaymentMethod, loanStatus } from '@/utils/dict.js';
  import financeApi from '@/api/finance.js';
	export default {
		data() {
			return {
				isEdit: false,
				loanId: null,
				customerData: null,
				hasPermission: true, // 可根据实际权限控制
				loanTypes: belongingCustomerGroup,
				loanTerms: [{label: '1年', value: '1'}, {label: '3年', value: '3'}, {label: '5年', value: '5'}],
        repaymentMethods: [{label: '等额本息', value: '1'}, {label: '先息后本', value: '2'}, {label: '随借随还', value: '3'}],
				loanStatuses: loanStatus,
				loanForm: {
					customerName: '',
					customerGroup: '',
					name: '',
					type: '',
					typeLabel: '',
          age_limit: null,
          age_limitLabel: '',
          due_type: '',
          due_typeLabel: '',
					channel: '',
					status: '',
					statusLabel: '',
          quota: '',
					rejectReason: '',
					disbursementDate: ''
				}
			}
		},
		onLoad(options) {
			const customerData = JSON.parse(decodeURIComponent(options.customerData));
      console.log(customerData, 'customerData')
			this.customerData = customerData;
			if (options.id) {
				// 编辑模式
				this.loanId = options.id;
				this.isEdit = true;
				this.loadLoanData();
			} else if (options.customerId) {
				// 新增模式，带客户ID
				this.loadCustomerData(options.customerId);
			}
		},
		methods: {
			getClientType(type) {
				return this.loanTypes.find(item => item.value == type)?.label || '';
			},
			// 加载客户数据
			loadCustomerData(customerId) {
				// 模拟获取客户数据
				// 实际项目中应该调用API获取
				this.loanForm.customerName = this.customerData.name;
				this.loanForm.customerGroup = this.customerData.group;
			},
			
			// 加载贷款数据（编辑模式）
			loadLoanData() {
				// 模拟获取贷款数据
				// 实际项目中应该调用API获取
				this.loanForm = {
					customerName: this.customerData.name,
					customerGroup: this.customerData.group,
					name: '个人消费贷款',
					type: '消费',
					typeLabel: '消费',
          age_limit: 1,
          age_limitLabel: '1年',
          due_type: '等额本息',
          due_typeLabel: '等额本息',
					channel: '线上申请',
					status: '批款',
					statusLabel: '批款',
          quota: '50000',
					rejectReason: '',
					disbursementDate: ''
				};
			},
			
			// 贷款类型选择
			onLoanTypeChange(e) {
				this.loanForm.type = this.loanTypes[e.detail.value].value;
				this.loanForm.typeLabel = this.loanTypes[e.detail.value].label;
			},
			
			// 贷款期限选择
			onLoanTermChange(e) {
				const term = this.loanTerms[e.detail.value];
				this.loanForm.age_limit = term.value;
				this.loanForm.age_limitLabel = term.label;
			},
			
			// 还款方式选择
			onRepaymentMethodChange(e) {
				this.loanForm.due_type = this.repaymentMethods[e.detail.value].value;
				this.loanForm.due_typeLabel = this.repaymentMethods[e.detail.value].label;
			},
			
			// 贷款状态选择
			onLoanStatusChange(e) {
				this.loanForm.status = this.loanStatuses[e.detail.value].value;
				this.loanForm.statusLabel = this.loanStatuses[e.detail.value].label;
			},
			
			// 放款日期选择
			onDateChange(e) {
				this.loanForm.disbursementDate = e.detail.value;
			},
			
			// 取消
			cancel() {
				uni.navigateBack();
			},
			
			// 提交表单
			submit() {
				// 表单验证
				if (!this.loanForm.name) {
					uni.showToast({
						title: '请输入贷款名称',
						icon: 'none'
					});
					return;
				}
				
				if (!this.loanForm.type) {
					uni.showToast({
						title: '请选择贷款类型',
						icon: 'none'
					});
					return;
				}
				
				if (!this.loanForm.age_limit) {
					uni.showToast({
						title: '请选择贷款期限',
						icon: 'none'
					});
					return;
				}
				
				if (!this.loanForm.due_type) {
					uni.showToast({
						title: '请选择还款方式',
						icon: 'none'
					});
					return;
				}
				if (!this.loanForm.quota) {
					uni.showToast({
						title: '请输入额度',
						icon: 'none'	
					})	
				}

				if (!this.loanForm.rate) {
					uni.showToast({
						title: '请输入利率',
						icon: 'none'
					});
					return;
				}

        // 提交数据
				uni.showLoading({
					title: '提交中...'
				});

        const params = {
          client_id: this.customerData.id,
          name: this.loanForm.name,
          type: this.loanForm.type,
          age_limit: this.loanForm.age_limit,
          due_type: this.loanForm.due_type,
          channel: this.loanForm.channel,
          quota: this.loanForm.quota
        }
        financeApi.addLoan(params).then(res => {
          console.log(res);
          if (res.retCode == 200) {
            uni.showToast({
              title: res.message,
              icon: 'success',
              duration: 1000
            });

            // 提交成功后返回上一页
            setTimeout(() => {
              uni.navigateBack();
            }, 1000);
          } else {
            uni.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000,
            });
          }
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
	
	.form-section {
		margin-bottom: 20px;
	}
	
	.section-title {
		font-size: 16px;
		color: #606266;
		margin-bottom: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #ebeef5;
	}
	
	.form-group {
		margin-bottom: 15px;
	}
	
	.form-label {
		font-size: 15px;
		color: #606266;
		margin-bottom: 8px;
	}

	.form-value {
		font-size: 14px;
		color: #333;
		word-break: break-all;
	}
	
	.form-input {
		height: 40px;
		padding: 0 12px;
		font-size: 14px;
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		background-color: #fff;
		box-sizing: border-box;
		width: 100%;
	}
	
	.picker-input {
		width: 100%;
	}
	
	.picker-display {
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
	
	.picker-value {
		font-size: 14px;
		color: #606266;
	}
	
	.picker-arrow {
		font-size: 12px;
		color: #c0c4cc;
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