import { http } from '@/utils/request'

// 部门相关接口
export const deptApi = {
  // 获取部门选择列表
  getDeptSelectList() {
    return http.get<{
      code: string
      message: string
      data: Array<{
        id: string
        departmentName: string
        status: string
      }>
    }>('/auth/dept/select')
  },
  // 分页查询部门
  getDeptPage(params: {
    current: number
    pageSize: number
    name: string
    leaderId: string
    status: string
  }) {
    return http.post<{
      code: string
      message: string
      data: Array<{
        id: string
        parentDepartmentName: string | null
        departmentName: string
        departmentPath: string
        leaderName: string
        leaderId: string
        status: string
        sortOrder: number
      }>
      total: number
      current: number
      size: number
    }>('/auth/dept/page', params)
  },
  // 获取部门负责人列表
  getDeptLeaderList() {
    return http.get<{
      code: string
      message: string
      data: Array<{
        id: string
        realName: string
      }>
    }>('/auth/dept/select/leader')
  },
  // 新增部门
  addDept(params: {
    parentDepartmentId?: string
    departmentName: string
    leaderId: string
  }) {
    return http.post<{
      code: string
      message: string
      data: any
    }>('/auth/dept/add', params)
  },
  // 删除部门
  deleteDept(id: string) {
    return http.delete<{
      code: string
      message: string
      data: string
    }>('/auth/dept/delete', {
      params: { id }
    })
  },
  // 根据角色查询用户
  getUserByRole(roleId: string) {
    return http.get<{
      code: string
      message: string
      data: Array<{
        id: string
        realName: string
      }>
    }>(`/auth/user/select/role?roleId=${roleId}`)
  },
}
