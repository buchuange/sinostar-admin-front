import request from '@/utils/request'

// 课程类别列表
export function listSubject(subjectQuery) {
  return request({
    url: `/dl/edu/api/subject/tree`,
    method: 'post',
    data: subjectQuery
  })
}
// 过滤课程类别树
export function listExcludeSubject(id) {
  return request({
    url: `/dl/edu/api/subject/tree/exclude/${id}`,
    method: 'get'
  })
}
// 删除课程类别
export function delSubject(id) {
  return request({
    url: `/dl/edu/api/subject/delete/${id}`,
    method: 'delete'
  })
}
// 添加课程类别
export function addSubject(subject) {
  return request({
    url: `/dl/edu/api/subject/save`,
    method: 'post',
    data: subject
  })
}
// 更新课程类别
export function updateSubject(subject) {
  return request({
    url: `/dl/edu/api/subject/update`,
    method: 'post',
    data: subject
  })
}
// 查询课程类别详细
export function getSubject(id) {
  return request({
    url: `/dl/edu/api/subject/detail/${id}`,
    method: 'get'
  })
}
