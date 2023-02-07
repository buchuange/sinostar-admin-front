import request from '@/utils/request'

// 添加课时信息
export function addLesson(lesson) {
  return request({
    url: `/dl/edu/api/lesson/save`,
    method: 'post',
    data: lesson
  })
}
// 更新课时信息
export function updateLesson(lesson) {
  return request({
    url: `/dl/edu/api/lesson/update`,
    method: 'post',
    data: lesson
  })
}

// 查询课时信息详细
export function getLesson(id) {
  return request({
    url: `/dl/edu/api/lesson/detail/${id}`,
    method: 'get'
  })
}

// 删除课时信息
export function delLesson(id) {
  return request({
    url: `/dl/edu/api/lesson/delete/${id}`,
    method: 'delete'
  })
}

// 删除课时信息
export function removeVideo(ids) {
  return request({
    url: `/dl/support/api/video/delete-batch`,
    method: 'post',
    data: ids
  })
}
