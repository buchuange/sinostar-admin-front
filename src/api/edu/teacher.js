import request from '@/utils/request'

// 讲师列表（条件查询分页）
export function listTeacher(teacherQuery) {
  return request({
    url: `/api/teacher/page-overview`,
    method: 'post',
    data: teacherQuery
  })
}

// 删除讲师
export function delTeacher(id) {
  return request({
    url: `/api/teacher/delete/${id}`,
    method: 'delete'
  })
}

// 添加讲师
export function addTeacher(teacher) {
  return request({
    url: `/api/teacher/save`,
    method: 'post',
    data: teacher
  })
}

// 更新讲师
export function updateTeacher(teacher) {
  return request({
    url: `/api/teacher/update`,
    method: 'post',
    data: teacher
  })
}

