import request from '../utils/request.js'

// 获取统计数据
export function getStatisticData(data) {
  return request.post('/home/get-statistic-data', data)
}

export default {
    getStatisticData
} 