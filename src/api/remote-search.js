import request from '@/utils/request'

export function searchUser(name) {
  return request({
    url: '/vue-element-admin/search/user',
    method: 'get',
    params: { name }
  })
}

export function transactionList(orderQuery) {
  return request({
    url: `/dl/edu/api/order/page-overview`,
    method: 'post',
    data: orderQuery
  })
}
