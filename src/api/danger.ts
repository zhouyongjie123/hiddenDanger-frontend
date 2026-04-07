import { http } from '@/utils/request'
import type { DangerRecordListResponse } from '@/types/api'

// 隐患记录相关接口
export const dangerApi = {
  // 查询隐患记录列表
  getDangerRecords(params: {
    departmentId: string
    riskLevel: string
    riskType: string
    status: string
    source: string
    name: string
    beginDiscoveryTime: string
    endDiscoveryTime: string
    beginRectificationDeadline: string
    endRectificationDeadline: string
    current: number
    size: number
  }) {
    return http.post<DangerRecordListResponse>('/risk/page', params)
  },
  // 上报隐患
  reportDanger(params: {
    name: string
    description: string
    location: string
    riskLevelCode: string
    riskTypeCode: string
    responsibleDepartmentId: string
    responsiblePersonId: string
    discoveryTime: string
    rectificationDeadline: string
    statusCode: string
    sourceCode: string
  }) {
    return http.post('/risk/report', params)
  },
}
