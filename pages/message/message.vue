<template>
	<view class="container">
	
		<view class="action-bar">
			<view class="action-btn-small" @click="handleMarkAllRead">
				<text>标记已读</text>
			</view>
			<view class="action-btn-small" @click="handleDeleteSelected">
				<text>删除</text>
			</view>
			<view class="action-btn-small" @click="handleMarkAllAsRead">
				<text>全部已读</text>
			</view>
			<view class="action-btn-small" @click="handleDeleteAll">
				<text>全部删除</text>
			</view>
		</view>
		
		<view class="message-list">
			<view v-if="messageList.length === 0" class="empty-message">
				<text>暂无消息</text>
			</view>
			
			<view v-else>
				<view class="message-item" v-for="(item, index) in messageList" :key="index" :class="{ 'message-unread': item.status === 0 }">
					<view class="checkbox">
						<view class="checkbox-inner" :class="{ checked: selectedMessages.includes(item.id) }" @click="toggleSelect(item.id)"></view>
					</view>
					
					<view class="message-content" @click="showMessageDetail(item)">
						<view class="message-header">
							<view class="message-names">
								<text class="name-tag" v-if="item.client_name">客户: {{ item.client_name }}</text>
							</view>
							<text class="message-time">{{ item.ctime || '' }}</text>
						</view>
						
						<view class="message-body">
							<text class="message-text">{{ item.info || '' }}</text>
						</view>
						
						<view class="message-actions">
							<view class="action-btn" @click.stop="handleDelete(item.id)">
								<text>删除</text>
							</view>
							<view class="action-btn" @click.stop="handleMarkRead(item.id)" v-if="item.status === 0">
								<text>标为已读</text>
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
	// import { getUserMsgList, handleUserMsg, getUserNoReadMsgList } from '@/api/msg.js';
	import msgApi from '@/api/msg.js';
	import tabbarUtils from '../../utils/tabbarUtils.js';
	import request from '@/utils/request.js';
    
	export default {
		data() {
			return {
				showFilterOption: false,
				currentFilter: '全部消息',
				selectedMessages: [],
				messageList: [],
				page: 1,
				pageSize: 10,
				total: 0,
				messageListTimer: null // 轮询定时器
			}
		},
		computed: {
			hasMoreData() {
				return this.messageList.length < this.total;
			}
		},
		onLoad() {
			this.loadMessageList();
			// 创建定时器，每分钟刷新一次消息列表
			this.startMessageListPolling();
		},
		onShow() {
			// App.vue 中已经处理了 tabbar 相关逻辑，这里不再需要单独处理
			// 每次页面显示时更新tabbar角标
			tabbarUtils.updateMessageBadge(1);
			
			// 如果没有定时器，重新启动
			if (!this.messageListTimer) {
				this.startMessageListPolling();
			}
		},
		onHide() {
			// 页面隐藏时清除定时器
			this.clearMessageListPolling();
		},
		onUnload() {
			// 页面卸载时清除定时器
			this.clearMessageListPolling();
		},
		methods: {
			// 启动消息列表轮询
			startMessageListPolling() {
				// 如果已经存在定时器，先清除
				this.clearMessageListPolling();
				
				// 创建新的定时器，60秒查询一次
				this.messageListTimer = setInterval(() => {
					console.log('轮询刷新消息列表');
					this.loadMessageList();
				}, 60000); // 60000毫秒 = 1分钟
			},
			
			// 清除消息列表轮询
			clearMessageListPolling() {
				if (this.messageListTimer) {
					clearInterval(this.messageListTimer);
					this.messageListTimer = null;
				}
			},
			// 加载消息列表
			async loadMessageList(isReset = true) {
				if (isReset) {
					this.page = 1;
					this.messageList = [];
				}
				
				try {
					uni.showLoading({
						title: '加载中...'
					});
					
					const params = {
						page: this.page,
						page_size: this.pageSize
					};
					
					const res = await msgApi.getUserMsgList(params);
					console.log(res, 'res')
					
					if (res.retCode === 200 && res.data) {
						const newMessages = res.data.list || [];
						this.total = res.data.total || 0;
						
						if (isReset) {
							this.messageList = newMessages;
						} else {
							this.messageList = [...this.messageList, ...newMessages];
						}
					} else {
						uni.showToast({
							title: res.message || '获取消息失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('获取消息列表失败', error);
					uni.showToast({
						title: '获取消息列表失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
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
			async showMessageDetail(item) {
				// 如果消息未读，则标记为已读
				if (item.status === 0) {
					await this.markRead(item.id);
				}
				
				// 弹出消息详情
				uni.showModal({
					title: '消息详情',
					content: item.info || '',
					showCancel: false
				});
			},
			
			// 处理删除单个消息
			async handleDelete(id) {
				uni.showModal({
					title: '提示',
					content: '确定要删除此消息吗？',
					success: async (res) => {
						if (res.confirm) {
							await this.deleteMessage(id);
						}
					}
				});
			},
			
			// 调用API删除消息
			async deleteMessage(id) {
				try {
					uni.showLoading({
						title: '删除中...'
					});
					
					const res = await msgApi.handleUserMsg({
						id,
						type: 'del'
					});
					
					if (res.success && res.retCode === 200) {
						// 从列表中删除
						this.messageList = this.messageList.filter(item => item.id !== id);
						this.selectedMessages = this.selectedMessages.filter(item => item !== id);
						
						uni.showToast({
							title: '删除成功',
							icon: 'success'
						});
					} else {
						uni.showToast({
							title: res.message || '删除失败',
							icon: 'none'
						});
					}
				} catch (error) {
					console.error('删除消息失败', error);
					uni.showToast({
						title: '删除消息失败',
						icon: 'none'
					});
				} finally {
					uni.hideLoading();
				}
			},
			
			// 标记消息为已读
			async handleMarkRead(id) {
				await this.markRead(id);
			},
			
			// 调用API标记消息为已读
			async markRead(id) {
				try {
					const res = await msgApi.handleUserMsg({
						id,
						type: 'update'
					});
					
					if (res.success && res.retCode === 200) {
						// 更新本地消息状态
						const index = this.messageList.findIndex(item => item.id === id);
						if (index !== -1) {
							this.messageList[index].status = 1; // 标记为已读
						}
						
						// 更新tabbar角标
						tabbarUtils.updateMessageBadge(1);
						
						uni.showToast({
							title: '已标记为已读',
							icon: 'success'
						});
						
						return true;
					} else {
						uni.showToast({
							title: res.message || '操作失败',
							icon: 'none'
						});
						return false;
					}
				} catch (error) {
					console.error('标记已读失败', error);
					uni.showToast({
						title: '标记已读失败',
						icon: 'none'
					});
					return false;
				}
			},
			
			// 标记选中消息为已读
			async handleMarkAllRead() {
				if (this.selectedMessages.length === 0) {
					uni.showToast({
						title: '请先选择消息',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: `确定要将已选中的 ${this.selectedMessages.length} 条消息标记为已读吗？`,
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '处理中...'
								});
								
								// 将id数组转为逗号分隔的字符串
								const messageIds = this.selectedMessages.join(',');
								
								// 批量标记为已读
								const result = await msgApi.handleUserMsg({
									id: messageIds,
									type: 'update'
								});
								
								if(result.success && result.retCode === 200) {
									// 更新选中消息的状态
									for (const id of this.selectedMessages) {
										const index = this.messageList.findIndex(item => item.id === id);
										if (index !== -1) {
											this.messageList[index].status = 1;
										}
									}
									
									// 更新tabbar角标
									tabbarUtils.updateMessageBadge(1);
									
									this.selectedMessages = [];
									
									uni.showToast({
										title: '操作成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: result.message || '操作失败',
										icon: 'none'
									});
								}
							} catch (error) {
								console.error('批量标记已读失败', error);
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							} finally {
								uni.hideLoading();
							}
						}
					}
				});
			},
			
			// 标记所有消息为已读
			async handleMarkAllAsRead() {
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
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '处理中...'
								});
								
								// 使用all参数标记全部已读
								const result = await msgApi.handleUserMsg({
									all: 1,
									type: 'update'
								});
								
								if(result.success && result.retCode === 200) {
									// 更新所有消息状态为已读
									this.messageList.forEach(item => {
										item.status = 1;
									});
									
									// 更新tabbar角标
									tabbarUtils.updateMessageBadge(1);
									
									uni.showToast({
										title: '已全部标记为已读',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: result.message || '操作失败',
										icon: 'none'
									});
								}
							} catch (error) {
								console.error('全部标记已读失败', error);
								uni.showToast({
									title: '操作失败',
									icon: 'none'
								});
							} finally {
								uni.hideLoading();
							}
						}
					}
				});
			},
			
			// 删除选中消息
			async handleDeleteSelected() {
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
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '删除中...'
								});
								
								// 将id数组转为逗号分隔的字符串
								const messageIds = this.selectedMessages.join(',');
								
								// 批量删除
								const result = await msgApi.handleUserMsg({
									id: messageIds,
									type: 'del'
								});
								
								if(result.success && result.retCode === 200) {
									// 从列表中移除被删除的消息
									this.messageList = this.messageList.filter(
										item => !this.selectedMessages.includes(item.id)
									);
									
									this.selectedMessages = [];
									
									uni.showToast({
										title: '删除成功',
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: result.message || '删除失败',
										icon: 'none'
									});
								}
							} catch (error) {
								console.error('批量删除失败', error);
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							} finally {
								uni.hideLoading();
							}
						}
					}
				});
			},
			
			// 删除所有消息
			async handleDeleteAll() {
				if (this.messageList.length === 0) {
					uni.showToast({
						title: '暂无消息',
						icon: 'none'
					});
					return;
				}
				
				uni.showModal({
					title: '提示',
					content: '确定要删除所有消息吗？',
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '删除中...'
								});
								
								// 循环删除每条消息
								for (const item of this.messageList) {
									await this.deleteMessage(item.id);
								}
								
								this.messageList = [];
								this.selectedMessages = [];
								
								uni.showToast({
									title: '已全部删除',
									icon: 'success'
								});
							} catch (error) {
								console.error('全部删除失败', error);
								uni.showToast({
									title: '删除失败',
									icon: 'none'
								});
							} finally {
								uni.hideLoading();
							}
						}
					}
				});
			},
			
			// 发送短信
			handleSendSMS(item) {
				uni.showModal({
					title: '发送短信',
					content: `确定要给客户发送短信吗？`,
					success: async (res) => {
						if (res.confirm) {
							try {
								uni.showLoading({
									title: '发送中...'
								});
								
								// 调用发送短信API
								const result = await request.post('/doc/send-sms', {
									client_id: item.client_id,
									message_id: item.id
								});
								
								if (result.retCode === 200) {
									uni.showToast({
										title: result.success,
										icon: 'success'
									});
								} else {
									uni.showToast({
										title: result.message || '发送失败',
										icon: 'none'
									});
								}
							} catch (error) {
								console.error('发送短信失败', error);
								uni.showToast({
									title: error.message,
									icon: 'none'
								});
							} finally {
								uni.hideLoading();
							}
						}
					}
				});
			},
			
			// 加载更多
			loadMore() {
				if (!this.hasMoreData) return;
				
				this.page++;
				this.loadMessageList(false);
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