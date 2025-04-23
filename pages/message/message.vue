<template>
	<view class="container">
	
		<view class="action-bar">
			<view class="action-btn-small" @click="handleMarkAllRead">
				<text>标记已读</text>
			</view>
			<view class="action-btn-small" @click="handleDeleteSelected">
				<text>删除</text>
			</view>
			<view class="action-btn-small" @click="handleMarkAllRead">
				<text>全部已读</text>
			</view>
			<view class="action-btn-small" @click="handleDeleteSelected">
				<text>全部删除</text>
			</view>
		</view>
		
		<view class="message-list">
			<view v-if="messageList.length === 0" class="empty-message">
				<text>暂无消息</text>
			</view>
			
			<view v-else>
				<view class="message-item" v-for="(item, index) in messageList" :key="index" :class="{ 'message-unread': !item.read }">
					<view class="checkbox">
						<view class="checkbox-inner" :class="{ checked: selectedMessages.includes(item.id) }" @click="toggleSelect(item.id)"></view>
					</view>
					
					<view class="message-content" @click="showMessageDetail(item)">
						<view class="message-header">
							<view class="message-names">
								<text class="name-tag">客户: {{ item.name1 }}</text>
								<text class="name-tag">产品员: {{ item.name2 }}</text>
								<text class="name-tag">业务员: {{ item.name3 }}</text>
							</view>
							<text class="message-time">{{ item.time }}</text>
						</view>
						
						<view class="message-body">
							<text class="message-text">{{ item.content }}</text>
						</view>
						
						<view class="message-actions">
							<view class="action-btn" @click.stop="handleDelete(item.id)">
								<text>删除</text>
							</view>
							<view class="action-btn" @click.stop="handleMarkRead(item.id)">
								<text>{{ item.read ? '标为未读' : '标为已读' }}</text>
							</view>
							<view class="action-btn" @click.stop="handleSendSMS(item)">
								<text>发送短信</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="load-more" v-if="messageList.length > 0" @click="loadMore">
			<text v-if="hasMoreData">加载更多</text>
			<text v-else>没有更多数据了</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showFilterOption: false,
				currentFilter: '全部消息',
				selectedMessages: [],
				messageList: [],
				page: 1,
				pageSize: 10,
				hasMoreData: true
			}
		},
		onLoad() {
			this.loadMessageList();
		},
		methods: {
			// 加载消息列表
			loadMessageList() {
				// 模拟消息数据
				// 实际项目中应该调用API获取
				const newMessages = [];
				
				// 模拟数据
				for (let i = 1; i <= 10; i++) {
					const id = (this.page - 1) * 10 + i;
					newMessages.push({
						id: id,
						name1: `客户${id}`,
						name2: `产品员${id % 3 + 1}`,
						name3: `业务员${id % 5 + 1}`,
						content: `这是一条测试消息，内容为客户资料变更通知，请及时处理。消息ID: ${id}`,
						time: this.generateRandomDate(),
						read: id % 3 === 0 // 模拟部分已读
					});
				}
				
				// 模拟是否还有更多数据
				this.hasMoreData = this.page < 3;
				
				if (this.page === 1) {
					this.messageList = newMessages;
				} else {
					this.messageList = [...this.messageList, ...newMessages];
				}
			},
			
			// 生成随机日期
			generateRandomDate() {
				const now = new Date();
				const days = Math.floor(Math.random() * 7);
				const hours = Math.floor(Math.random() * 24);
				const minutes = Math.floor(Math.random() * 60);
				
				const date = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000 + hours * 60 * 60 * 1000 + minutes * 60 * 1000));
				
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hour = String(date.getHours()).padStart(2, '0');
				const minute = String(date.getMinutes()).padStart(2, '0');
				
				return `${year}-${month}-${day} ${hour}:${minute}`;
			},
			
			// 选择筛选条件
			selectFilter(filter) {
				this.currentFilter = filter;
				this.showFilterOption = false;
				this.page = 1;
				this.loadMessageList();
			},
			
			// 切换选中状态
			toggleSelect(id) {
				const index = this.selectedMessages.findIndex(item => item === id);
				if (index === -1) {
					this.selectedMessages.push(id);
				} else {
					this.selectedMessages.splice(index, 1);
				}
			},
			
			// 显示消息详情
			showMessageDetail(item) {
				// 标记为已读
				if (!item.read) {
					const index = this.messageList.findIndex(msg => msg.id === item.id);
					if (index !== -1) {
						this.messageList[index].read = true;
					}
				}
				
				// 可以跳转到详情页或者弹出详情对话框
				uni.showModal({
					title: '消息详情',
					content: item.content,
					showCancel: false
				});
			},
			
			// 处理删除
			handleDelete(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除此消息吗？',
					success: res => {
						if (res.confirm) {
							// 模拟删除操作
							this.messageList = this.messageList.filter(item => item.id !== id);
							this.selectedMessages = this.selectedMessages.filter(item => item !== id);
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 标记已读/未读
			handleMarkRead(id) {
				const index = this.messageList.findIndex(item => item.id === id);
				if (index !== -1) {
					this.messageList[index].read = !this.messageList[index].read;
					uni.showToast({
						title: this.messageList[index].read ? '已标记为已读' : '已标记为未读',
						icon: 'success'
					});
				}
			},
			
			// 全部标记已读
			handleMarkAllRead() {
				if (this.messageList.length === 0) {
					uni.showToast({
						title: '暂无消息',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: '确定要将所有消息标记为已读吗？',
					success: res => {
						if (res.confirm) {
							this.messageList.forEach(item => {
								item.read = true;
							});
							uni.showToast({
								title: '已全部标记为已读',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 删除选中
			handleDeleteSelected() {
				if (this.selectedMessages.length === 0) {
					uni.showToast({
						title: '请先选择消息',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: `确定要删除已选中的 ${this.selectedMessages.length} 条消息吗？`,
					success: res => {
						if (res.confirm) {
							// 模拟删除操作
							this.messageList = this.messageList.filter(item => !this.selectedMessages.includes(item.id));
							this.selectedMessages = [];
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 发送短信
			handleSendSMS(item) {
				uni.showModal({
					title: '发送短信',
					content: `确定要给${item.name1}发送短信吗？`,
					success: res => {
						if (res.confirm) {
							uni.showToast({
								title: '短信发送成功',
								icon: 'success'
							});
						}
					}
				});
			},
			
			// 加载更多
			loadMore() {
				if (!this.hasMoreData) return;
				
				this.page++;
				this.loadMessageList();
			}
		}
	}
</script>

<style>
	.container {
		min-height: 100vh;
		background-color: #f5f7fa;
		padding: 15px;
		padding-bottom: 80px; /* 为tabbar预留空间 */
	}
	
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;
	}
	
	.header-title {
		font-size: 18px;
		font-weight: bold;
		color: #303133;
	}
	
	.filter-dropdown {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #409EFF;
	}
	
	.dropdown-icon {
		margin-left: 5px;
		font-size: 12px;
	}
	
	.filter-dropdown-menu {
		background-color: #fff;
		border-radius: 4px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 15px;
		overflow: hidden;
	}
	
	.filter-item {
		padding: 12px 15px;
		font-size: 14px;
		color: #606266;
		border-bottom: 1px solid #ebeef5;
	}
	
	.filter-item.active {
		color: #409EFF;
		background-color: #ecf5ff;
	}
	
	.filter-item:last-child {
		border-bottom: none;
	}
	
	.action-bar {
		display: flex;
		margin-bottom: 15px;
	}
	
	.action-btn-small {
		background-color: #ecf5ff;
		color: #409EFF;
		padding: 8px 12px;
		margin-right: 10px;
		border-radius: 4px;
		font-size: 12px;
	}
	
	.message-list {
		margin-bottom: 15px;
	}
	
	.empty-message {
		background-color: #fff;
		border-radius: 8px;
		padding: 30px;
		text-align: center;
		color: #909399;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.message-item {
		display: flex;
		background-color: #fff;
		border-radius: 8px;
		padding: 15px;
		margin-bottom: 10px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
	}
	
	.message-unread {
		border-left: 3px solid #409EFF;
	}
	
	.checkbox {
		margin-right: 10px;
		display: flex;
		align-items: flex-start;
		padding-top: 3px;
	}
	
	.checkbox-inner {
		width: 18px;
		height: 18px;
		border: 1px solid #dcdfe6;
		border-radius: 2px;
		position: relative;
	}
	
	.checkbox-inner.checked {
		background-color: #409EFF;
		border-color: #409EFF;
	}
	
	.checkbox-inner.checked::after {
		content: '';
		position: absolute;
		left: 6px;
		top: 2px;
		width: 4px;
		height: 8px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}
	
	.message-content {
		flex: 1;
	}
	
	.message-header {
		margin-bottom: 8px;
	}
	
	.message-names {
		display: flex;
		flex-wrap: wrap;
		flex: 1;
	}
	
	.name-tag {
		font-size: 12px;
		color: #606266;
		background-color: #f5f7fa;
		padding: 2px 6px;
		border-radius: 4px;
		margin-right: 6px;
		margin-bottom: 6px;
	}
	
	.message-time {
		font-size: 12px;
		color: #909399;
		white-space: nowrap;
	}
	
	.message-body {
		margin-bottom: 10px;
	}
	
	.message-text {
		font-size: 14px;
		color: #303133;
		line-height: 1.5;
	}
	
	.message-actions {
		display: flex;
		border-top: 1px solid #ebeef5;
		padding-top: 10px;
	}
	
	.action-btn {
		margin-right: 15px;
		font-size: 12px;
		color: #409EFF;
	}
	
	.load-more {
		text-align: center;
		color: #909399;
		font-size: 14px;
		padding: 10px 0;
	}
</style> 