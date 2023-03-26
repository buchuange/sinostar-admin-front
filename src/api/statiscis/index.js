import request from '@/utils/request'

export function executeNow() {
  return request({
    url: `/dl/edu/api/statistics/execute-now`,
    method: 'get'
  })
}

export function showCharts(searchObj) {
  return request({
    url: `/dl/edu/api/statistics/show-charts`,
    method: 'post',
    data: searchObj
  })
}
