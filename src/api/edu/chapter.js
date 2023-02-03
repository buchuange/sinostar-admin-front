import request from '@/utils/request'

// 章节列表
export function listChapter(id) {
  return request({
    url: `/dl/edu/api/chapter/list/${id}`,
    method: 'get'
  })
}
// 删除章节信息
export function delChapter(id) {
  return request({
    url: `/dl/edu/api/chapter/delete/${id}`,
    method: 'delete'
  })
}
// 添加章节信息
export function addChapter(chapter) {
  return request({
    url: `/dl/edu/api/chapter/save`,
    method: 'post',
    data: chapter
  })
}
// 更新章节信息
export function updateChapter(chapter) {
  return request({
    url: `/dl/edu/api/chapter/update`,
    method: 'post',
    data: chapter
  })
}
// 查询章节信息详细
export function getChapter(id) {
  return request({
    url: `/dl/edu/api/chapter/detail/${id}`,
    method: 'get'
  })
}
