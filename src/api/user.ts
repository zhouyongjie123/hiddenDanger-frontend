import { http } from '@/utils/request'
import type { UserListResponse, ApiResponse } from '@/types/api'

// 用户管理相关接口
export const userApi = {
  // 分页查询用户列表
  getUserList(params: {
    current?: number
    pageSize?: number
    departmentId?: string
    roleId?: string
  }) {
    return http.post<ApiResponse<any>>('/auth/user/page', params)
  },
  // 新增用户
  register(params: {
    account: string
    password?: string
    realName: string
    phoneNumber: string
    departmentId: string
    roleId: string
    avatarUrl?: string
  }) {
    return http.post('/auth/user/register', params)
  },
  // 获取用户选择列表
  getUserSelectList(params: {
    departmentId: string
  }) {
    return http.get<ApiResponse<Array<{
      id: string
      realName: string
    }>>>('/auth/user/select', { params })
  },
  // 更新用户信息
  updateUser(params: {
    id: string
    account?: string
    password?: string
    realName?: string
    phoneNumber?: string
    departmentId?: string
    roleId?: string
    avatarUrl?: string
  }) {
    return http.put<ApiResponse<{
      id: string
      account: string
      realName: string
      phoneNumber: string
      departmentId: string
      departmentName: string
      avatarUrl: string
      roleId: string
      roleName: string
    }>>('/auth/user/update', params)
  },
  // 删除用户
  deleteUser(id: string) {
    return http.delete<ApiResponse<string>>('/auth/user/delete', {
      params: { id }
    })
  },
}
