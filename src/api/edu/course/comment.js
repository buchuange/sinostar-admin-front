import request from '@/utils/request'

export function listComment(commentQuery) {
  return request({
    url: `/dl/edu/api/comment/page-overview`,
    method: 'post',
    data: commentQuery
  })
}

export function queryCourseList() {
  return request({
    url: `/dl/edu/api/course/list`,
    method: 'get'
  })
}

export function delComment(id) {
  return request({
    url: `/dl/edu/api/comment/delete/${id}`,
    method: 'delete'
  })
}
