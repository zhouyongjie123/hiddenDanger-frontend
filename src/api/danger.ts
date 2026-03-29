import { http } from '@/utils/request'
import type { DangerRecordListResponse } from '@/types/api'

// 隐患记录相关接口
export const dangerApi = {
  // 查询隐患记录列表
  getDangerRecords(params: { current: number; pageSize: number }) {
    return http.get<DangerRecordListResponse>('/risk/page', { params })
  },
}
