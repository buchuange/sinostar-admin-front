import request from '@/utils/request'

// 教师列表（条件查询分页）
export function listTeacher(teacherQuery) {
  return request({
    url: `/dl/edu/api/teacher/page-overview`,
    method: 'post',
    data: teacherQuery
  })
}

// 教师列表
export function queryTeacherList() {
  return request({
    url: `/dl/edu/api/teacher/list`,
    method: 'get'
  })
}

// 删除教师
export function delTeacher(id) {
  return request({
    url: `/dl/edu/api/teacher/delete/${id}`,
    method: 'delete'
  })
}

// 添加教师
export function addTeacher(teacher) {
  return request({
    url: `/dl/edu/api/teacher/save`,
    method: 'post',
    data: teacher
  })
}

// 更新教师
export function updateTeacher(teacher) {
  return request({
    url: `/dl/edu/api/teacher/update`,
    method: 'post',
    data: teacher
  })
}

// 查询角色详细
export function getTeacher(id) {
  return request({
    url: `/dl/edu/api/teacher/detail/${id}`,
    method: 'get'
  })
}

