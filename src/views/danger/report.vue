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
          <el-select v-model="reportForm.riskLevel" placeholder="请选择风险等级">
            <el-option v-for="(level, key) in riskLevelMap" :key="key" :label="level.name" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="风险类型" prop="riskType">
          <el-select v-model="reportForm.riskType" placeholder="请选择风险类型">
            <el-option v-for="(type, key) in riskTypeMap" :key="key" :label="type.name" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item label="责任部门" prop="responsibleDepartmentName">
          <el-input v-model="reportForm.responsibleDepartmentName" placeholder="请输入责任部门" />
        </el-form-item>
        <el-form-item label="责任人" prop="responsiblePersonName">
          <el-input v-model="reportForm.responsiblePersonName" placeholder="请输入责任人" />
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
          <el-select v-model="reportForm.source" placeholder="请选择来源">
            <el-option v-for="(source, key) in riskSourceMap" :key="key" :label="source.name" :value="key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            提交
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button @click="router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { Check, Refresh, ArrowLeft } from '@element-plus/icons-vue'
import { RiskLevel, RiskType, RiskSource, riskLevelMap, riskTypeMap, riskSourceMap } from '@/utils/enums'

const router = useRouter()
const reportFormRef = ref<FormInstance>()

// 上报表单
const reportForm = reactive({
  name: '',
  description: '',
  location: '',
  riskLevel: RiskLevel.LOW,
  riskType: RiskType.OTHER,
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
  responsibleDepartmentName: [
    { required: true, message: '请输入责任部门', trigger: 'blur' }
  ],
  responsiblePersonName: [
    { required: true, message: '请输入责任人', trigger: 'blur' }
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

// 提交表单
const handleSubmit = async () => {
  if (!reportFormRef.value) return
  
  try {
    await reportFormRef.value.validate()
    // 模拟提交
    ElMessage.success('隐患上报成功')
    router.push('/danger')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

// 重置表单
const handleReset = () => {
  reportFormRef.value?.resetFields()
}
</script>

<style scoped lang="scss">
.danger-report-container {
  .page-header {
    margin-bottom: 24px;

    .page-title {
      font-size: 28px;
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
    border-radius: 12px;

    .report-form {
      :deep(.el-form-item) {
        margin-bottom: 20px;
      }

      :deep(.el-button) {
        margin-right: 12px;
      }
    }
  }
}
</style>
