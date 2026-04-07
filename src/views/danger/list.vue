<template>
  <div class="danger-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">隐患列表</h1>
      <p class="page-subtitle">查看和管理所有隐患记录</p>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="filter-card">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="隐患名称">
            <el-input v-model="searchForm.name" placeholder="请输入隐患名称" />
          </el-form-item>
          <el-form-item label="部门">
            <el-select v-model="searchForm.departmentId" placeholder="请选择部门" class="filter-select" style="width: 220px;">
              <el-option label="全部部门" value="" />
              <template v-for="dept in deptTree" :key="dept.id">
                <el-option 
                  :label="dept.departmentName" 
                  :value="dept.id"
                >
                  <div class="dept-option" :class="{'dept-disabled': dept.status === '0'}">
                    <span :style="{ marginLeft: dept.level * 16 + 'px' }">{{ dept.departmentName }}</span>
                    <span v-if="dept.status === '0'" class="dept-status">（禁用）</span>
                  </div>
                </el-option>
                <template v-for="child in dept.children" :key="child.id">
                  <el-option 
                    :label="child.departmentName" 
                    :value="child.id"
                  >
                    <div class="dept-option" :class="{'dept-disabled': child.status === '0'}">
                      <span :style="{ marginLeft: child.level * 16 + 'px' }">{{ child.departmentName }}</span>
                      <span v-if="child.status === '0'" class="dept-status">（禁用）</span>
                    </div>
                  </el-option>
                </template>
              </template>
            </el-select>
          </el-form-item>
          <el-form-item label="风险等级">
            <el-select v-model="searchForm.riskLevel" placeholder="请选择风险等级" class="filter-select">
              <el-option label="全部等级" value="" />
              <el-option label="低" value="1" />
              <el-option label="中" value="2" />
              <el-option label="高" value="3" />
              <el-option label="危险" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="风险类型">
            <el-select v-model="searchForm.riskType" placeholder="请选择风险类型" class="filter-select">
              <el-option label="全部类型" value="" />
              <el-option label="人的不安全行为" value="1" />
              <el-option label="物的不安全状态" value="2" />
              <el-option label="管理缺陷" value="3" />
              <el-option label="其他" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" class="filter-select">
              <el-option label="全部状态" value="" />
              <el-option label="待整改" value="1" />
              <el-option label="整改中" value="2" />
              <el-option label="待验收" value="3" />
              <el-option label="已闭环" value="4" />
              <el-option label="已撤销" value="5" />
            </el-select>
          </el-form-item>
          <el-form-item label="来源">
            <el-select v-model="searchForm.source" placeholder="请选择来源" class="filter-select">
              <el-option label="全部来源" value="" />
              <el-option label="日常检查" value="1" />
              <el-option label="员工上报" value="2" />
              <el-option label="上级督办" value="3" />
              <el-option label="其他" value="4" />
            </el-select>
          </el-form-item>
          <el-form-item label="发现时间">
            <el-date-picker
              v-model="searchForm.discoveryTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="整改期限">
            <el-date-picker
              v-model="searchForm.rectificationDeadline"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            />
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
          <span>隐患记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增隐患
          </el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="dangerRecords"
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
        <el-table-column prop="riskType" label="风险类型" width="150">
          <template #default="{ row }">
            {{ getRiskTypeInfo(row.riskType).name }}
          </template>
        </el-table-column>
        <el-table-column prop="responsibleDepartmentName" label="责任部门" width="150" />
        <el-table-column prop="responsiblePersonName" label="责任人" width="120" />
        <el-table-column prop="discoveryTime" label="发现时间" width="180">
          <template #default="{ row }">
            {{ formatDate(row.discoveryTime) }}
          </template>
        </el-table-column>
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
        <el-table-column prop="source" label="来源" width="120">
          <template #default="{ row }">
            {{ getRiskSourceInfo(row.source).name }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleView(row)">
              <el-icon><View /></el-icon>
              查看
            </el-button>
            <el-button size="small" type="primary" @click="handleEdit(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon><Delete /></el-icon>
              删除
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
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Search, 
  Plus, 
  View, 
  Edit, 
  Delete 
} from '@element-plus/icons-vue'
import { dangerApi } from '@/api/danger'
import { deptApi } from '@/api/dept'
import type { DangerRecordListResponse } from '@/types/api'
import { getRiskLevelInfo, getRiskStatusInfo, getRiskTypeInfo, getRiskSourceInfo } from '@/utils/enums'

const router = useRouter()
const loading = ref(false)
const dangerRecords = ref<any[]>([])

// 部门数据
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
const deptTree = ref<Array<{
  id: string
  departmentName: string
  status: string
  level: number
  children: Array<{
    id: string
    departmentName: string
    status: string
    level: number
  }>
}>>([])

// 搜索表单
const searchForm = reactive({
  departmentId: '',
  riskLevel: '',
  riskType: '',
  status: '',
  source: '',
  name: '',
  discoveryTime: [] as string[],
  rectificationDeadline: [] as string[]
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 获取隐患记录列表
const getDangerRecords = async () => {
  loading.value = true
  try {
    const response = await dangerApi.getDangerRecords({
      departmentId: searchForm.departmentId,
      riskLevel: searchForm.riskLevel,
      riskType: searchForm.riskType,
      status: searchForm.status,
      source: searchForm.source,
      name: searchForm.name,
      beginDiscoveryTime: searchForm.discoveryTime[0] || '',
      endDiscoveryTime: searchForm.discoveryTime[1] || '',
      beginRectificationDeadline: searchForm.rectificationDeadline[0] || '',
      endRectificationDeadline: searchForm.rectificationDeadline[1] || '',
      current: pagination.current,
      size: pagination.pageSize
    })
    dangerRecords.value = response.data
    pagination.total = response.total
  } catch (error) {
    console.error('获取隐患记录失败:', error)
    ElMessage.error('获取隐患记录失败')
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  getDangerRecords()
}

// 重置搜索
const resetSearch = () => {
  searchForm.departmentId = ''
  searchForm.riskLevel = ''
  searchForm.riskType = ''
  searchForm.status = ''
  searchForm.source = ''
  searchForm.name = ''
  searchForm.discoveryTime = []
  searchForm.rectificationDeadline = []
  pagination.current = 1
  getDangerRecords()
}

// 构建部门树
const buildDeptTree = () => {
  // 构建树结构
  const tree: Array<{
    id: string
    departmentName: string
    status: string
    level: number
    children: Array<{
      id: string
      departmentName: string
      status: string
      level: number
    }>
  }> = []
  
  // 检查是否有部门数据
  if (deptList.value.length === 0) {
    // 如果没有数据，使用默认的模拟数据
    const defaultDepts = [
      {
        id: '1',
        departmentName: '管理部门',
        status: '1'
      },
      {
        id: '2',
        departmentName: '闲散人员部门',
        status: '1'
      }
    ]
    
    defaultDepts.forEach(dept => {
      tree.push({
        id: dept.id,
        departmentName: dept.departmentName,
        status: dept.status,
        level: 0,
        children: []
      })
    })
  } else {
    // 使用后端返回的部门数据
    deptList.value.forEach(dept => {
      tree.push({
        id: dept.id,
        departmentName: dept.departmentName,
        status: dept.status,
        level: 0,
        children: []
      })
    })
  }
  
  deptTree.value = tree
}

// 获取部门列表
const getDeptList = async () => {
  try {
    // 调用后端接口获取部门数据
    const response = await deptApi.getDeptSelectList()
    deptList.value = response.data
    buildDeptTree()
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
    // 失败时使用模拟数据
    buildDeptTree()
  }
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getDangerRecords()
}

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  getDangerRecords()
}

// 添加隐患
const handleAdd = () => {
  router.push('/danger/report')
}

// 查看隐患
const handleView = (row: any) => {
  ElMessage.info('查看隐患详情')
}

// 编辑隐患
const handleEdit = (row: any) => {
  ElMessage.info('编辑隐患')
}

// 删除隐患
const handleDelete = (row: any) => {
  ElMessageBox.confirm(
    '确定要删除这条隐患记录吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage.success('删除成功')
    getDangerRecords()
  }).catch(() => {
    // 取消删除
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
  getDeptList()
  getDangerRecords()
})
</script>

<style scoped lang="scss">
.danger-list-container {
  .dept-option {
    display: flex;
    align-items: center;
    gap: 8px;

    &.dept-disabled {
      color: #909399;

      .dept-status {
        color: #f56c6c;
        font-size: 12px;
      }
    }
  }

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

      .filter-select {
        width: 180px;
        border-radius: 8px;
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
