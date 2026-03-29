<template>
  <div class="danger-track-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">整改跟踪</h1>
      <p class="page-subtitle">跟踪和管理隐患整改进度</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="filter-card">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="隐患名称">
            <el-input v-model="searchForm.name" placeholder="请输入隐患名称" />
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态">
              <el-option label="待整改" value="待整改" />
              <el-option label="整改中" value="整改中" />
              <el-option label="已整改" value="已整改" />
              <el-option label="已关闭" value="已关闭" />
            </el-select>
          </el-form-item>
          <el-form-item label="责任部门">
            <el-input v-model="searchForm.responsibleDepartmentName" placeholder="请输入责任部门" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="hover" class="data-card">
      <template #header>
        <div class="card-header">
          <span>整改跟踪记录</span>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="trackRecords"
        style="width: 100%"
      >
        <el-table-column prop="name" label="隐患名称" width="180" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="location" label="位置" width="150" />
        <el-table-column prop="riskLevel" label="风险等级" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskLevelInfo(row.riskLevel).type">
              {{ getRiskLevelInfo(row.riskLevel).name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="responsibleDepartmentName" label="责任部门" width="150" />
        <el-table-column prop="responsiblePersonName" label="责任人" width="120" />
        <el-table-column prop="rectificationDeadline" label="整改期限" width="180">
          <template #default="{ row }">
            {{ formatDate(row.rectificationDeadline) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getRiskStatusInfo(row.status).type">
              {{ getRiskStatusInfo(row.status).name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button size="small" type="primary" @click="handleUpdateStatus(row)">
              <el-icon><Edit /></el-icon>
              更新状态
            </el-button>
            <el-button size="small" type="success" @click="handleClose(row)">
              <el-icon><Check /></el-icon>
              关闭
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElSelect, ElOption } from 'element-plus'
import { 
  Search, 
  View, 
  Edit, 
  Check 
} from '@element-plus/icons-vue'
import { dangerApi } from '@/api/danger'
import { getRiskLevelInfo, getRiskStatusInfo, getRiskTypeInfo, getRiskSourceInfo } from '@/utils/enums'

const loading = ref(false)
const trackRecords = ref<any[]>([])

// 搜索表单
const searchForm = reactive({
  name: '',
  status: '',
  responsibleDepartmentName: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 获取整改跟踪记录
const getTrackRecords = async () => {
  loading.value = true
  try {
    const response = await dangerApi.getDangerRecords({
      current: pagination.current,
      pageSize: pagination.pageSize
    })
    trackRecords.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('获取整改跟踪记录失败:', error)
    ElMessage.error('获取整改跟踪记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  getTrackRecords()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.status = ''
  searchForm.responsibleDepartmentName = ''
  pagination.current = 1
  getTrackRecords()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getTrackRecords()
}

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  getTrackRecords()
}

// 查看记录
const handleView = (row: any) => {
  ElMessage.info('查看整改详情')
}

// 更新状态
const handleUpdateStatus = (row: any) => {
  ElMessageBox.confirm(
    '确定要更新状态吗？',
    '状态更新',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'primary'
    }
  ).then(() => {
    ElMessage.success('状态更新成功')
    getTrackRecords()
  }).catch(() => {
    // 取消更新
  })
}

// 关闭隐患
const handleClose = (row: any) => {
  ElMessageBox.confirm(
    '确定要关闭这条隐患记录吗？',
    '关闭确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'success'
    }
  ).then(() => {
    ElMessage.success('隐患关闭成功')
    getTrackRecords()
  }).catch(() => {
    // 取消关闭
  })
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 页面加载时获取数据
onMounted(() => {
  getTrackRecords()
})
</script>

<style scoped lang="scss">
.danger-track-container {
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

  .search-filter {
    margin-bottom: 24px;

    .filter-card {
      border-radius: 12px;
    }

    .search-form {
      :deep(.el-form-item) {
        margin-right: 16px;
      }
    }
  }

  .data-card {
    border-radius: 12px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
    }

    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
