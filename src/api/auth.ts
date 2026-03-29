import { http } from '@/utils/request'
import type { LoginRequest, LoginResponse, UserInfo } from '@/types/api'

// 认证相关接口
export const authApi = {
  // 用户登录
  login(data: LoginRequest) {
    return http.post<LoginResponse>('/auth/login', data)
  },

  // 用户登出
  logout() {
    return http.delete('/auth/logout')
  },

  // 获取当前用户信息
  getUserInfo() {
    return http.get<{ data: UserInfo }>('/auth/userInfo')
  },
}
