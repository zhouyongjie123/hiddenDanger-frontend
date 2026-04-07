import { http } from '@/utils/request'

// 角色相关接口
export const roleApi = {
  // 获取角色选择列表
  getRoleSelectList() {
    return http.get<{
      code: string
      message: string
      data: Array<{
        id: string
        roleName: string
      }>
    }>('/auth/role/select')
  },
  // 获取领导角色选择列表
  getLeaderRoleSelectList() {
    return http.get<{
      code: string
      message: string
      data: Array<{
        id: string
        roleName: string
      }>
    }>('/auth/role/select/leader')
  },
  // 新增角色
  addRole(params: {
    roleName: string
    roleCode: string
  }) {
    return http.post<{
      code: string
      message: string
      data: {
        id: string
        roleName: string
        roleCode: string
      }
    }>('/auth/role/add', params)
  },
  // 删除角色
  deleteRole(id: string) {
    return http.delete<{
      code: string
      message: string
      data: null
    }>(`/auth/role/delete/${id}`)
  },
}
