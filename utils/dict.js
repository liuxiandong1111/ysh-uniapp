// 婚姻状态
export const maritalStatus = [
    {
        label: '未婚',
        value: 1
    },
    {
        label: '已婚',
        value: 2
    },
    {
        label: '离异',
        value: 3
    }
]

// 审批状态
export const approvalStatus = [
    {
        label: '开户中',
        value: 1
    },
    {
        label: '批款',
        value: 2
    },
    {
        label: '拒绝',
        value: 3
    }
]

// 客户进度
export const customerProgress = [
    {
        label: '待处理',
        value: 1
    },
    {
        label: '已处理',
        value: 2
    },
    {
        label: '已完成',
        value: 3
    }
]

// 客户状态
export const customerStatus = [
    {
        label: '未联系',
        value: 1
    },
    {
        label: '电话联系',
        value: 2
    },
    {
        label: '客户到访',
        value: 3
    },
    {
        label: '提交材料',
        value: 4
    },
    {
        label: '完成',
        value: 5
    }
]

// 所属客群/客户类型
export const customerType = [
    {
        label: '个人客户',
        value: 1
    },
    {
        label: '企业客户',
        value: 2
    },
    {
        label: '个体工商户',
        value: 3
    }
]

// 所属客群
export const belongingCustomerGroup = [
    {
        label: '消费',
        value: 1
    },
    {
        label: '经营',
        value: 2
    },
    {
        label: '消费经营',
        value: 3
    }
]

// 还款方式
export const repaymentMethod = [
    {
        label: '先息后本',
        value: 1
    },
    {
        label: '等额本息',
        value: 2
    },
    {
        label: '随借随还',
        value: 3
    }
]

// 还款状态
export const repaymentStatus = [
    {
        label: '正常',
        value: 1
    },
    {
        label: '逾期',
        value: 2
    }
]

// 成交状态
export const dealStatus = [
    {
        label: '未审批',
        value: 1
    },
    {
        label: '审批中',
        value: 2
    },
    {
        label: '已通过',
        value: 3
    },
    {
        label: '已拒绝',
        value: 4
    }
]

// 工具方法 - 根据值获取标签
export const getLabelByValue = (dict, value) => {
    const item = dict.find(item => item.value === value);
    return item ? item.label : '未知';
}

// 根据字典创建映射对象
export const createDictMap = (dict) => {
    const map = {};
    dict.forEach(item => {
        map[item.value] = item.label;
    });
    return map;
}

// 导出所有字典的映射对象
export const dictMaps = {
    maritalStatus: createDictMap(maritalStatus),
    approvalStatus: createDictMap(approvalStatus),
    customerProgress: createDictMap(customerProgress),
    customerStatus: createDictMap(customerStatus),
    customerType: createDictMap(customerType),
    belongingCustomerGroup: createDictMap(belongingCustomerGroup),
    repaymentMethod: createDictMap(repaymentMethod),
    repaymentStatus: createDictMap(repaymentStatus),
    dealStatus: createDictMap(dealStatus)
} 