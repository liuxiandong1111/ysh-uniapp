/**
 * 动态tabbar工具类 - 简化版
 * 主要功能已移到 custom-tabbar 组件
 */

/**
 * tabbar工具类
 */
export default {
  /**
   * 根据权限获取tabbar类型
   * @param {Object} permissions 权限配置
   * @return {String} tabbar类型名称
   */
  getTabBarTypeByPermissions(permissions) {
    // 根据权限判断用户角色
    if (permissions.customer && !permissions.loan) {
      return 'manager'; // 只有客户权限，是客户经理
    } else if (!permissions.customer && permissions.loan) {
      return 'loanOfficer'; // 只有贷款权限，是贷款专员
    } else {
      return 'default'; // 默认配置
    }
  },

  /**
   * 检查用户是否有权限访问指定的tabbar页面
   * @param {String} path 页面路径
   * @param {Object} permissions 权限配置
   * @return {Boolean} 是否有权限
   */
  hasPermission(path, permissions) {
    // 首页和消息中心一般都有权限
    if (path.indexOf('dashboard') !== -1 || path.indexOf('message') !== -1) {
      return true;
    }
    
    // 客户页面
    if (path.indexOf('customer') !== -1) {
      return permissions.customer === true;
    }
    
    // 贷款页面
    if (path.indexOf('loan') !== -1) {
      return permissions.loan === true;
    }
    
    return false;
  },
  
  /**
   * 初始化tabbar配置
   * 这个方法只是为了保持接口兼容，实际功能由custom-tabbar实现
   */
  initTabBar() {
    console.log('tabbar将由custom-tabbar组件控制');
    return true;
  },
  
  /**
   * 更新消息角标
   * @param {Number} index tabbar的索引，默认为1（一般消息页在第二个位置）
   */
  updateMessageBadge(index = 1) {
    // 导入消息API
    import('@/api/msg.js').then(msgModule => {
      msgModule.default.getUserNoReadMsgList().then(res => {
        if (res && res.retCode === 200 && res.data) {
          const count = res.data.total || 0;
          
          if (count > 0) {
            // 设置角标
            uni.setTabBarBadge({
              index: index,
              text: count.toString()
            });
          } else {
            // 移除角标
            uni.removeTabBarBadge({
              index: index
            });
          }
        }
      }).catch(err => {
        console.error('获取未读消息数失败', err);
      });
    });
  }
}; 