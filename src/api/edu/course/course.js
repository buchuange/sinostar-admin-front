import request from '@/utils/request'

// 讲师列表（条件查询分页）
export function listTeacher(teacherQuery) {
  return request({
    url: `/api/teacher/page-overview`,
    method: 'post',
    data: teacherQuery
  })
}

// 发布课程
export function publishCourse(id) {
  return request({
    url: `/dl/edu/api/course/publish/${id}`,
    method: 'post'
  })
}

// 添加课程
export function addCourse(course) {
  return request({
    url: `/dl/edu/api/course/save`,
    method: 'post',
    data: course
  })
}

// 更新课程
export function updateCourse(teacher) {
  return request({
    url: `/dl/edu/api/course/update`,
    method: 'post',
    data: teacher
  })
}

// 查询课程详细
export function getCourse(id) {
  return request({
    url: `/dl/edu/api/course/detail/${id}`,
    method: 'get'
  })
}

