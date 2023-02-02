import request from '@/utils/request'

// 讲师列表（条件查询分页）
export function listTeacher(teacherQuery) {
  return request({
    url: `/api/teacher/page-overview`,
    method: 'post',
    data: teacherQuery
  })
}

// 讲师列表
export function queryTeacherList() {
  return request({
    url: `/api/teacher/list`,
    method: 'get'
  })
}

// 删除讲师
export function delTeacher(id) {
  return request({
    url: `/dl/edu/api/teacher/delete/${id}`,
    method: 'delete'
  })
}

// 添加讲师
export function addCourse(course) {
  return request({
    url: `/dl/edu/api/course/save`,
    method: 'post',
    data: course
  })
}

// 更新讲师
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

