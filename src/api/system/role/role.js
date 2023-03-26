import request from '@/utils/request'

// 角色列表（条件查询分页）
export function listRole(roleQuery) {
  return request({
    url: `/dl/uaa/api/role/page-overview`,
    method: 'post',
    data: roleQuery
  })
}

// 删除用户信息
export function delUser(id) {
  return request({
    url: `/dl/uaa/api/user/delete/${id}`,
    method: 'delete'
  })
}

// 添加用户
export function addUser(user) {
  return request({
    url: `/dl/uaa/api/user/save`,
    method: 'post',
    data: user
  })
}

// 更新用户
export function updateUser(user) {
  return request({
    url: `/dl/uaa/api/user/update`,
    method: 'post',
    data: user
  })
}

// 查询用户详细
export function getUser(id) {
  return request({
    url: `/dl/uaa/api/user/detail/${id}`,
    method: 'get'
  })
}

// 修改用户状态
export function changeUserStatus(id) {
  return request({
    url: `/dl/uaa/api/user/change-status/${id}`,
    method: 'put'
  })
}

// 重置用户密码
export function resetPassword(user) {
  return request({
    url: `/dl/uaa/api/user/reset-password`,
    method: 'post',
    data: user
  })
}
