// 后端接口统一响应类型
export interface ApiResponse<T = any> {
  code: string
  message: string
  data: T
  total?: number
  current?: number
  size?: number
}

// 登录请求参数（支持两种登录方式）
export interface LoginRequest {
  account?: string
  password?: string
  phoneNumber?: string
  verificationCode?: string
}

// 登录返回的用户信息
export interface UserInfo {
  id: string
  account: string
  realName: string
  phoneNumber: string
  departmentName: string
  roleName: string
  tokenName: string
  tokenValue: string
  avatarUrl: string
}

// 登录接口响应类型
export type LoginResponse = ApiResponse<UserInfo>

// 隐患记录
interface DangerRecord {
  name: string
  description: string
  location: string
  riskLevel: string
  riskType: string
  responsibleDepartmentName: string
  responsiblePersonName: string
  discoveryTime: string
  rectificationDeadline: string
  status: string
  source: string
}

// 隐患记录列表响应
export type DangerRecordListResponse = ApiResponse<DangerRecord[]>

// 用户信息
export interface User {
  id: string
  account: string
  realName: string
  phoneNumber: string
  departmentId: string
  departmentName: string
  roleId: string
  roleName: string
  avatarUrl: string
}

// 用户列表响应
export type UserListResponse = ApiResponse<User[]>
