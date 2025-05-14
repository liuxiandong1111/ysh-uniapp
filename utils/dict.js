export const maritalStatus = [ // 婚姻状态
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
    },
]

export const approvalStatus = [ // 审批状态
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

export const customerProgress = [ // 客户进度
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

export const customerStatus = [ // 客户状态
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

export const belongingCustomerGroup = [ // 所属客群
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

export const repaymentMethod = [ // 还款方式
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

export const repaymentStatus = [ // 还款状态
    {
        label: '正常',
        value: 1
    },
    {
        label: '预期',
        value: 2
    }
]

// 字典映射对象
export const dictMaps = {
    // 客户状态字典
    customerStatus: {
        1: '未联系',
        2: '电话联系',
        3: '客户到访',
        4: '提交材料',
        5: '完成'
    },
    
    // 婚姻状态字典
    maritalStatus: {
        1: '未婚',
        2: '已婚',
        3: '离异'
    },
    
    // 客户类型字典
    customerType: {
        1: '个人客户',
        2: '企业客户',
        3: '个体工商户'
    },
    
    // 审批状态字典
    dealStatus: {
        1: '未审批',
        2: '审批中',
        3: '已通过',
        4: '已拒绝'
    }
}
