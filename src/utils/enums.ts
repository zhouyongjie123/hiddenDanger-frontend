// 风险等级枚举
export enum RiskLevel {
  LOW = '1',
  MIDDLE = '2',
  HIGH = '3',
  DANGER = '4'
}

// 风险等级映射
export const riskLevelMap = {
  [RiskLevel.LOW]: { code: '1', name: '低', type: 'success' },
  [RiskLevel.MIDDLE]: { code: '2', name: '中', type: 'warning' },
  [RiskLevel.HIGH]: { code: '3', name: '高', type: 'danger' },
  [RiskLevel.DANGER]: { code: '4', name: '危险', type: 'danger' }
}

// 风险状态枚举
export enum RiskStatus {
  WAIT_RECTIFY = '1',
  RECTIFYING = '2',
  WAIT_ACCEPTANCE = '3',
  CLOSED = '4',
  CANCELED = '5'
}

// 风险状态映射
export const riskStatusMap = {
  [RiskStatus.WAIT_RECTIFY]: { code: '1', name: '待整改', type: 'warning' },
  [RiskStatus.RECTIFYING]: { code: '2', name: '整改中', type: 'primary' },
  [RiskStatus.WAIT_ACCEPTANCE]: { code: '3', name: '待验收', type: 'info' },
  [RiskStatus.CLOSED]: { code: '4', name: '已闭环', type: 'success' },
  [RiskStatus.CANCELED]: { code: '5', name: '已撤销', type: 'danger' }
}

// 风险类型枚举
export enum RiskType {
  PEOPLE_UNSAFE_BEHAVIOR = '1',
  MATERIAL_UNSAFE_STATUS = '2',
  MANAGEMENT_DEFECT = '3',
  OTHER = '4'
}

// 风险类型映射
export const riskTypeMap = {
  [RiskType.PEOPLE_UNSAFE_BEHAVIOR]: { code: '1', name: '人的不安全行为' },
  [RiskType.MATERIAL_UNSAFE_STATUS]: { code: '2', name: '物的不安全行为' },
  [RiskType.MANAGEMENT_DEFECT]: { code: '3', name: '管理缺陷' },
  [RiskType.OTHER]: { code: '4', name: '其他' }
}

// 风险来源枚举
export enum RiskSource {
  DAILY_CHECK = '1',
  EMPLOYEE_REPORT = '2',
  SUPERVISOR_SUPERVISE = '3',
  OTHER = '4'
}

// 风险来源映射
export const riskSourceMap = {
  [RiskSource.DAILY_CHECK]: { code: '1', name: '日常检查' },
  [RiskSource.EMPLOYEE_REPORT]: { code: '2', name: '员工上报' },
  [RiskSource.SUPERVISOR_SUPERVISE]: { code: '3', name: '上级督办' },
  [RiskSource.OTHER]: { code: '4', name: '其他' }
}

// 获取风险等级信息
export const getRiskLevelInfo = (code: string) => {
  return riskLevelMap[code as RiskLevel] || { code, name: code, type: 'info' }
}

// 获取风险状态信息
export const getRiskStatusInfo = (code: string) => {
  return riskStatusMap[code as RiskStatus] || { code, name: code, type: 'info' }
}

// 获取风险类型信息
export const getRiskTypeInfo = (code: string) => {
  return riskTypeMap[code as RiskType] || { code, name: code }
}

// 获取风险来源信息
export const getRiskSourceInfo = (code: string) => {
  return riskSourceMap[code as RiskSource] || { code, name: code }
}
