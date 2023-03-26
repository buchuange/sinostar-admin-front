import request from '@/utils/request'

export function listOrder(orderQuery) {
  return request({
    url: `/dl/edu/api/order/page-overview`,
    method: 'post',
    data: orderQuery
  })
}

export function queryCourseList() {
  return request({
    url: `/dl/edu/api/course/list`,
    method: 'get'
  })
}

export function delOrder(id) {
  return request({
    url: `/dl/edu/api/order/delete/${id}`,
    method: 'delete'
  })
}
