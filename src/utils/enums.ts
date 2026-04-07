// 风险等级枚举 - 用于向后端传递的code值
export enum RiskLevel {
  LOW = '1',
  MIDDLE = '2',
  HIGH = '3',
  DANGER = '4'
}

// 风险等级映射 - 用于显示
export const riskLevelMap: Record<string, { code: string; name: string; type: string }> = {
  '1': { code: '1', name: '低', type: 'success' },
  '2': { code: '2', name: '中', type: 'warning' },
  '3': { code: '3', name: '高', type: 'danger' },
  '4': { code: '4', name: '危险', type: 'danger' }
}

// 风险状态枚举 - 用于向后端传递的code值
export enum RiskStatus {
  WAIT_RECTIFY = '1',
  RECTIFYING = '2',
  WAIT_ACCEPTANCE = '3',
  CLOSED = '4',
  CANCELED = '5'
}

// 风险状态映射 - 用于显示
export const riskStatusMap: Record<string, { code: string; name: string; type: string }> = {
  '1': { code: '1', name: '待整改', type: 'warning' },
  '2': { code: '2', name: '整改中', type: 'primary' },
  '3': { code: '3', name: '待验收', type: 'info' },
  '4': { code: '4', name: '已闭环', type: 'success' },
  '5': { code: '5', name: '已撤销', type: 'danger' }
}

// 风险类型枚举 - 用于向后端传递的code值
export enum RiskType {
  PEOPLE_UNSAFE_BEHAVIOR = '1',
  MATERIAL_UNSAFE_STATUS = '2',
  MANAGEMENT_DEFECT = '3',
  OTHER = '4'
}

// 风险类型映射 - 用于显示
export const riskTypeMap: Record<string, { code: string; name: string }> = {
  '1': { code: '1', name: '人的不安全行为' },
  '2': { code: '2', name: '物的不安全状态' },
  '3': { code: '3', name: '管理缺陷' },
  '4': { code: '4', name: '其他' }
}

// 风险来源枚举 - 用于向后端传递的code值
export enum RiskSource {
  DAILY_CHECK = '1',
  EMPLOYEE_REPORT = '2',
  SUPERVISOR_SUPERVISE = '3',
  OTHER = '4'
}

// 风险来源映射 - 用于显示
export const riskSourceMap: Record<string, { code: string; name: string }> = {
  '1': { code: '1', name: '日常检查' },
  '2': { code: '2', name: '员工上报' },
  '3': { code: '3', name: '上级督办' },
  '4': { code: '4', name: '其他' }
}

// 获取风险等级信息
export const getRiskLevelInfo = (value: string) => {
  // 先尝试通过代码查找
  if (riskLevelMap[value]) {
    return riskLevelMap[value]
  }
  
  // 如果找不到，尝试通过名称查找
  for (const key in riskLevelMap) {
    if (riskLevelMap[key].name === value) {
      return riskLevelMap[key]
    }
  }
  
  // 如果都找不到，返回默认值
  return { code: value, name: value, type: 'info' }
}

// 获取风险状态信息
export const getRiskStatusInfo = (code: string) => {
  return riskStatusMap[code] || { code, name: code, type: 'info' }
}

// 获取风险类型信息
export const getRiskTypeInfo = (code: string) => {
  return riskTypeMap[code] || { code, name: code }
}

// 获取风险来源信息
export const getRiskSourceInfo = (code: string) => {
  return riskSourceMap[code] || { code, name: code }
}
