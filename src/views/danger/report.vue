<template>
  <div class="danger-report-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">隐患上报</h1>
      <p class="page-subtitle">提交新的隐患记录</p>
    </div>

    <!-- 上报表单 -->
    <el-card shadow="hover" class="report-card">
      <el-form
        ref="reportFormRef"
        :model="reportForm"
        :rules="reportRules"
        label-width="120px"
        class="report-form"
      >
        <el-form-item label="隐患名称" prop="name">
          <el-input v-model="reportForm.name" placeholder="请输入隐患名称" />
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input
            v-model="reportForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入隐患描述"
          />
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="reportForm.location" placeholder="请输入隐患位置" />
        </el-form-item>
        <el-form-item label="风险等级" prop="riskLevel">
          <el-select 
            v-model="reportForm.riskLevel" 
            placeholder="请选择风险等级" 
            style="width: 100%"
            class="risk-level-select"
            :class="{
              'low-level': reportForm.riskLevel === '1',
              'medium-level': reportForm.riskLevel === '2',
              'high-level': reportForm.riskLevel === '3',
              'danger-level': reportForm.riskLevel === '4'
            }"
          >
            <el-option v-for="(level, key) in riskLevelMap" :key="key" :value="key" :label="level.name">
              <div class="risk-level-option">
                <span>{{ level.name }}</span>
                <div class="level-color" :class="{
                  'level-low': key === '1',
                  'level-medium': key === '2',
                  'level-high': key === '3',
                  'level-danger': key === '4'
                }"></div>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="风险类型" prop="riskType">
          <el-select v-model="reportForm.riskType" placeholder="请选择风险类型" style="width: 100%">
            <el-option v-for="(type, key) in riskTypeMap" :key="key" :label="type.name" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="departmentId">
          <el-select v-model="reportForm.departmentId" placeholder="请选择责任部门" style="width: 100%">
            <el-option
              v-for="dept in deptList"
              :key="dept.id"
              :label="dept.departmentName"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePersonId">
          <el-select v-model="reportForm.responsiblePersonId" placeholder="请选择责任人" style="width: 100%" :disabled="!reportForm.departmentId">
            <el-option
              v-for="user in userList"
              :key="user.id"
              :label="user.realName"
              :value="user.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="发现时间" prop="discoveryTime">
          <el-date-picker
            v-model="reportForm.discoveryTime"
            type="datetime"
            placeholder="请选择发现时间"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="整改期限" prop="rectificationDeadline">
          <el-date-picker
            v-model="reportForm.rectificationDeadline"
            type="datetime"
            placeholder="请选择整改期限"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="来源" prop="source">
          <el-select v-model="reportForm.source" placeholder="请选择来源" style="width: 100%">
            <el-option v-for="(source, key) in riskSourceMap" :key="key" :label="source.name" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit" :loading="submitting">
            <el-icon><Check /></el-icon>
            提交
          </el-button>
          <el-button @click="handleReset" :disabled="submitting">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button @click="router.back()" :disabled="submitting">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Check, Refresh, ArrowLeft } from '@element-plus/icons-vue'
import { RiskLevel, RiskType, RiskSource, riskLevelMap, riskTypeMap, riskSourceMap } from '@/utils/enums'
import { deptApi } from '@/api/dept'
import { userApi } from '@/api/user'
import { dangerApi } from '@/api/danger'

const router = useRouter()
const reportFormRef = ref<FormInstance>()

// 部门和用户数据
const deptList = ref<Array<{
  id: string
  departmentName: string
  status: string
  parentDepartmentName?: string
  departmentPath?: string
  leaderName?: string
  leaderId?: string
  sortOrder?: number
}>>([])
const userList = ref<Array<{
  id: string
  realName: string
}>>([])
const loading = ref(false)
const usersLoading = ref(false)

// 上报表单
const reportForm = reactive({
  name: '',
  description: '',
  location: '',
  riskLevel: RiskLevel.LOW,
  riskType: RiskType.OTHER,
  departmentId: '',
  responsiblePersonId: '',
  responsibleDepartmentName: '',
  responsiblePersonName: '',
  discoveryTime: new Date(),
  rectificationDeadline: new Date(),
  source: RiskSource.DAILY_CHECK
})

// 表单验证规则
const reportRules: FormRules = {
  name: [
    { required: true, message: '请输入隐患名称', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入隐患描述', trigger: 'blur' }
  ],
  location: [
    { required: true, message: '请输入隐患位置', trigger: 'blur' }
  ],
  riskLevel: [
    { required: true, message: '请选择风险等级', trigger: 'change' }
  ],
  riskType: [
    { required: true, message: '请选择风险类型', trigger: 'change' }
  ],
  departmentId: [
    { required: true, message: '请选择责任部门', trigger: 'change' }
  ],
  responsiblePersonId: [
    { required: true, message: '请选择责任人', trigger: 'change' }
  ],
  discoveryTime: [
    { required: true, message: '请选择发现时间', trigger: 'change' }
  ],
  rectificationDeadline: [
    { required: true, message: '请选择整改期限', trigger: 'change' }
  ],
  source: [
    { required: true, message: '请选择来源', trigger: 'change' }
  ]
}

// 获取部门列表
const getDeptList = async () => {
  loading.value = true
  try {
    const response = await deptApi.getDeptSelectList()
    deptList.value = response.data
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 获取用户列表
const getUserList = async (departmentId: string) => {
  if (!departmentId) {
    userList.value = []
    return
  }
  
  usersLoading.value = true
  try {
    const response = await userApi.getUserSelectList({ departmentId })
    userList.value = response.data
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    usersLoading.value = false
  }
}

// 监听部门变化
watch(() => reportForm.departmentId, (newDepartmentId) => {
  reportForm.responsiblePersonId = ''
  reportForm.responsiblePersonName = ''
  getUserList(newDepartmentId)
  
  // 更新部门名称
  if (newDepartmentId) {
    const department = deptList.value.find(dept => dept.id === newDepartmentId)
    if (department) {
      reportForm.responsibleDepartmentName = department.departmentName
    }
  } else {
    reportForm.responsibleDepartmentName = ''
  }
})

// 监听用户变化
watch(() => reportForm.responsiblePersonId, (newPersonId) => {
  if (newPersonId) {
    const user = userList.value.find(user => user.id === newPersonId)
    if (user) {
      reportForm.responsiblePersonName = user.realName
    }
  } else {
    reportForm.responsiblePersonName = ''
  }
})

// 页面加载时获取部门列表
getDeptList()

// 提交表单
const submitting = ref(false)

const handleSubmit = async () => {
  if (!reportFormRef.value) return
  
  try {
    await reportFormRef.value.validate()
    
    submitting.value = true
    
    // 构建请求参数
    const requestData = {
      name: reportForm.name,
      description: reportForm.description,
      location: reportForm.location,
      riskLevelCode: reportForm.riskLevel,
      riskTypeCode: reportForm.riskType,
      responsibleDepartmentId: reportForm.departmentId,
      responsiblePersonId: reportForm.responsiblePersonId,
      discoveryTime: new Date(reportForm.discoveryTime).toISOString(),
      rectificationDeadline: new Date(reportForm.rectificationDeadline).toISOString(),
      statusCode: '1', // 默认为待整改状态
      sourceCode: reportForm.source
    }
    
    // 调用后端接口
    await dangerApi.reportDanger(requestData)
    
    ElMessage.success('隐患上报成功')
    router.push('/danger')
  } catch (error) {
    console.error('表单验证失败或提交失败:', error)
    ElMessage.error('隐患上报失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 重置表单
const handleReset = () => {
  reportFormRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
// 主题色变量
$primary-color: #e94560;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

.danger-report-container {
  .page-header {
    margin-bottom: 32px;
    animation: fadeInUp 0.5s ease-out;

    .page-title {
      font-size: 32px;
      font-weight: 700;
      color: #1a1a2e;
      margin: 0 0 8px 0;
    }

    .page-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }
  }

  .report-card {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .report-form {
      padding: 24px;

      :deep(.el-form-item) {
        margin-bottom: 24px;

        &:last-child {
          margin-bottom: 0;
        }
      }

      :deep(.el-input__wrapper) {
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.1);
        }

        &.is-focus {
          box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
        }
      }

      :deep(.el-select) {
        :deep(.el-select__wrapper) {
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.1);
          }

          &.is-focus {
            box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
          }
        }

        :deep(.el-select__prefix) {
          margin-right: 8px;
        }

        :deep(.el-select-dropdown) {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        :deep(.el-select-dropdown__item) {
          &:hover {
            background-color: rgba(233, 69, 96, 0.1);
          }

          &.is-selected {
            background-color: rgba(233, 69, 96, 0.2);
            color: $primary-color;
          }
        }
      }

      // 风险等级选择框特殊样式
      :deep(.el-select.risk-level-select) {
        :deep(.el-select__wrapper) {
          border-left: 4px solid transparent;
          transition: all 0.3s ease;

          &.low-level {
            border-left-color: $success-color;
          }
          &.medium-level {
            border-left-color: $warning-color;
          }
          &.high-level {
            border-left-color: $danger-color;
          }
          &.danger-level {
            border-left-color: $primary-color;
          }
        }
      }

      :deep(.el-date-picker) {
        :deep(.el-input__wrapper) {
          border-radius: 8px;
        }
      }

      :deep(.el-textarea__inner) {
        border-radius: 8px;
        transition: all 0.3s ease;

        &:hover {
          box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.1);
        }

        &:focus {
          box-shadow: 0 0 0 2px rgba(233, 69, 96, 0.2);
        }
      }

      :deep(.el-button) {
        border-radius: 8px;
        margin-right: 12px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }

        &.el-button--primary {
          background: linear-gradient(135deg, $primary-color 0%, #ff6b6b 100%);
          border: none;

          &:hover {
            background: linear-gradient(135deg, #ff6b6b 0%, $primary-color 100%);
          }
        }

        &.el-button--default {
          border: 1px solid #e4e7ed;

          &:hover {
            border-color: $primary-color;
            color: $primary-color;
          }
        }
      }
    }
  }

  // 风险等级颜色指示器
  .risk-level-option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;

    .level-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;

      &.level-low {
        background-color: $success-color;
      }

      &.level-medium {
        background-color: $warning-color;
      }

      &.level-high {
        background-color: $danger-color;
      }

      &.level-danger {
        background: linear-gradient(135deg, $danger-color 0%, #e94560 100%);
      }
    }
  }
}

// 动画效果
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
