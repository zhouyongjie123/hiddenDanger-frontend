<template>
  <div class="dept-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <el-icon :size="32"><OfficeBuilding /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">部门管理</h1>
            <p class="page-subtitle">管理系统部门信息，包括部门层级、负责人和状态等信息</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ deptList.length }}</div>
            <div class="stat-label">当前显示</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalDepts }}</div>
            <div class="stat-label">总部门数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="filter-card">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="部门名称">
            <el-input v-model="searchForm.name" placeholder="请输入部门名称" class="filter-input" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="负责人">
            <el-select v-model="searchForm.leaderId" placeholder="请选择负责人" class="filter-select" style="width: 180px;">
              <el-option label="全部" value="" />
              <el-option
                v-for="leader in leaderList"
                :key="leader.id"
                :label="leader.realName"
                :value="leader.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" class="filter-select">
              <el-option label="全部" value="" />
              <el-option label="启用" value="1" />
              <el-option label="禁用" value="0" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch" class="search-button">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
            <el-button @click="resetSearch" class="reset-button">
              <el-icon><Refresh /></el-icon>
              重置
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <!-- 部门列表表格 -->
    <el-card shadow="hover" class="data-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">部门管理</span>
          <el-button type="primary" @click="handleAddTopLevelDept" class="add-button">
            <el-icon><Plus /></el-icon>
            新增顶级部门
          </el-button>
        </div>
      </template>
      
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="filteredDeptTreeData"
        style="width: 100%"
        class="dept-table"
        :row-class-name="rowClassName"
        stripe
        border
        row-key="id"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren'
        }"
        @row-click="handleRowClick"
      >
        <el-table-column prop="departmentName" label="部门名称" align="center">
          <template #default="{ row }">
            <el-link 
              :type="row.status === '禁用' ? 'danger' : 'primary'" 
              @click="handleView(row)"
              class="department-link"
              :class="{ 'disabled-department': row.status === '禁用' }"
            >
              <el-icon v-if="row.status === '禁用'" class="status-icon"><Close /></el-icon>
              {{ row.departmentName }}
              <span v-if="row.status === '禁用'" class="status-tag">(禁用)</span>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="leaderName" label="负责人" align="center">
          <template #default="{ row }">
            <el-link 
              type="primary" 
              @click="handleLeaderClick(row.leaderId, row.leaderName)"
              class="leader-link"
            >
              {{ row.leaderName }}
            </el-link>
          </template>
        </el-table-column>
        <el-table-column prop="leaderPhoneNumber" label="负责人电话" align="center" />
        <el-table-column prop="userCount" label="用户数" align="center">
          <template #default="{ row }">
            <div class="stat-box user-count">
              <el-icon class="stat-icon"><User /></el-icon>
              <span>{{ row.userCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalHiddenRiskCount" label="总隐患数" align="center">
          <template #default="{ row }">
            <div class="stat-box total-risk">
              <el-icon class="stat-icon"><Warning /></el-icon>
              <span>{{ row.totalHiddenRiskCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="closedHiddenRiskCount" label="已闭环隐患" align="center">
          <template #default="{ row }">
            <div class="stat-box closed-risk">
              <el-icon class="stat-icon"><Check /></el-icon>
              <span>{{ row.closedHiddenRiskCount }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="waitRectifyHiddenRiskCount" label="待整改隐患" align="center">
          <template #default="{ row }">
            <div class="stat-box pending-risk">
              <el-icon class="stat-icon"><Timer /></el-icon>
              <span>{{ row.waitRectifyHiddenRiskCount }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="300">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" type="primary" @click="handleEdit(row)" class="action-button edit-button">
                <el-icon><Edit /></el-icon>
                编辑
              </el-button>
              <el-button size="small" type="warning" @click="handleAddChildDept(row)" class="action-button add-child-button">
                <el-icon><Plus /></el-icon>
                新增子部门
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)" class="action-button delete-button">
                <el-icon><Delete /></el-icon>
                删除
              </el-button>
            </div>
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
          class="custom-pagination"
        />
      </div>
    </el-card>

    <!-- 负责人信息对话框 -->
    <el-dialog
      v-model="leaderInfoDialogVisible"
      title="负责人信息"
      width="550px"
      destroy-on-close
      custom-class="leader-info-dialog"
    >
      <div class="leader-info-container">
        <div class="leader-header">
          <div class="leader-avatar">
            <el-avatar :size="80" :src="leaderInfo?.avatarUrl || undefined" :icon="UserFilled" />
          </div>
          <div class="leader-basic-info">
            <h3 class="leader-name">{{ leaderInfo?.realName }}</h3>
            <p class="leader-role">{{ leaderInfo?.roleName }} | {{ leaderInfo?.departmentName }}</p>
          </div>
        </div>
        
        <div class="leader-details">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="账号">{{ leaderInfo?.account }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ leaderInfo?.phoneNumber }}</el-descriptions-item>
            <el-descriptions-item label="部门" span="2">{{ leaderInfo?.departmentName }}</el-descriptions-item>
            <el-descriptions-item label="角色" span="2">{{ leaderInfo?.roleName }}</el-descriptions-item>
            <el-descriptions-item label="用户ID" span="2">{{ leaderInfo?.id }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="leaderInfoDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 部门详情对话框 -->
    <el-dialog
      v-model="deptDetailDialogVisible"
      title="部门详情"
      width="600px"
      destroy-on-close
      custom-class="dept-detail-dialog"
      :close-on-click-modal="false"
    >
      <div class="dept-detail-container">
        <!-- 部门基本信息 -->
        <div class="dept-header">
          <div class="dept-info">
            <h3 class="dept-name">{{ deptDetail?.departmentName }}</h3>
            <div class="dept-meta">
              <el-tag :type="deptDetail?.status === '禁用' ? 'danger' : 'success'" size="small">
                {{ deptDetail?.status === '禁用' ? '已禁用' : '正常' }}
              </el-tag>
              <span class="dept-id">ID: {{ deptDetail?.id }}</span>
            </div>
          </div>
        </div>
        
        <!-- 部门统计信息 -->
        <div class="dept-stats">
          <div class="stat-item">
            <div class="stat-icon user-icon">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ deptDetail?.userCount }}</div>
              <div class="stat-label">用户数</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon risk-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ deptDetail?.totalHiddenRiskCount }}</div>
              <div class="stat-label">总隐患</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon closed-icon">
              <el-icon><Check /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ deptDetail?.closedHiddenRiskCount }}</div>
              <div class="stat-label">已闭环</div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon pending-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ deptDetail?.waitRectifyHiddenRiskCount }}</div>
              <div class="stat-label">待整改</div>
            </div>
          </div>
        </div>
        
        <!-- 部门详细信息 -->
        <div class="dept-details">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="上级部门">{{ deptDetail?.parentDepartmentName || '无' }}</el-descriptions-item>
            <el-descriptions-item label="部门路径">{{ deptDetail?.departmentPath }}</el-descriptions-item>
            <el-descriptions-item label="负责人">{{ deptDetail?.leaderName }}</el-descriptions-item>
            <el-descriptions-item label="负责人电话">{{ deptDetail?.leaderPhoneNumber }}</el-descriptions-item>
            <el-descriptions-item label="排序">{{ deptDetail?.sortOrder }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="deptDetailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 新增部门对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      :title="isChildDept ? '新增子部门' : '新增顶级部门'"
      width="500px"
      center
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        class="add-dept-form"
      >
        <el-form-item label="部门名称" prop="departmentName">
          <el-input v-model="addForm.departmentName" placeholder="请输入部门名称" />
        </el-form-item>
        <el-form-item label="领导角色" prop="roleId">
          <el-select v-model="addForm.roleId" placeholder="请选择领导角色" @change="handleRoleChange">
            <el-option 
              v-for="role in rolesList" 
              :key="role.id" 
              :label="role.roleName" 
              :value="role.id" 
            />
          </el-select>
        </el-form-item>
        <el-form-item label="部门负责人" prop="leaderId">
          <el-select v-model="addForm.leaderId" placeholder="请选择部门负责人" :disabled="!addForm.roleId">
            <el-option 
              v-for="user in deptLeaderList" 
              :key="user.id" 
              :label="user.realName" 
              :value="user.id" 
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'
import {
  Search,
  Plus,
  View,
  Edit,
  Delete,
  OfficeBuilding,
  Refresh,
  User,
  Warning,
  Check,
  Timer,
  UserFilled,
  Close
} from '@element-plus/icons-vue'
import { deptApi } from '@/api/dept'
import { roleApi } from '@/api/role'

// 部门类型定义
interface Department {
  id: string
  parentDepartmentName: string | null
  departmentName: string
  departmentPath: string
  leaderName: string
  leaderId: string
  status: string
  sortOrder: number
  userCount: number
  leaderPhoneNumber: string
  totalHiddenRiskCount: number
  closedHiddenRiskCount: number
  waitRectifyHiddenRiskCount: number
}

// 树节点类型定义
interface TreeNode {
  id: string
  departmentName: string
  parentDepartmentId?: string
  parentDepartmentName?: string
  departmentPath: string
  leaderName: string
  leaderId: string
  status: string
  sortOrder: number
  userCount: number
  leaderPhoneNumber: string
  totalHiddenRiskCount: number
  closedHiddenRiskCount: number
  waitRectifyHiddenRiskCount: number
  children?: TreeNode[]
  hasChildren?: boolean
}

const loading = ref(false)
const deptList = ref<Department[]>([])
const deptTreeData = ref<TreeNode[]>([])
const deptTreeTableData = ref<TreeNode[]>([])
const totalDepts = ref(0)
const tableRef = ref<InstanceType<typeof ElTable>>()

// 搜索表单
const searchForm = reactive({
  name: '',
  leaderId: '',
  status: ''
})

// 部门负责人列表
const leaderList = ref<Array<{
  id: string
  realName: string
}>>([])

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 过滤后的部门列表（树形结构）
const filteredDeptTreeData = computed(() => {
  return deptTreeTableData.value
})

// 构建部门树
const buildDeptTree = async () => {
  loading.value = true
  try {
    const response = await deptApi.getDeptPage({
      current: pagination.current,
      pageSize: pagination.pageSize,
      name: searchForm.name,
      leaderId: searchForm.leaderId,
      status: searchForm.status
    })
    
    const depts = response.data
    deptList.value = depts
    totalDepts.value = response.total
    pagination.total = response.total
    
    // 构建树结构
    const treeMap = new Map<string, TreeNode>()
    
    // 首先创建所有节点
    depts.forEach(dept => {
      treeMap.set(dept.id, {
        id: dept.id,
        departmentName: dept.departmentName,
        parentDepartmentId: dept.parentDepartmentId,
        parentDepartmentName: dept.parentDepartmentName || '无',
        departmentPath: dept.departmentPath,
        leaderName: dept.leaderName,
        leaderId: dept.leaderId,
        status: dept.status,
        sortOrder: dept.sortOrder,
        userCount: dept.userCount,
        leaderPhoneNumber: dept.leaderPhoneNumber,
        totalHiddenRiskCount: dept.totalHiddenRiskCount,
        closedHiddenRiskCount: dept.closedHiddenRiskCount,
        waitRectifyHiddenRiskCount: dept.waitRectifyHiddenRiskCount,
        children: []
      })
    })
    
    // 构建树的层级关系
    const treeData: TreeNode[] = []
    treeMap.forEach(node => {
      if (!node.parentDepartmentId || node.parentDepartmentId === 'null' || node.parentDepartmentId === 'undefined') {
        // 顶级部门
        treeData.push(node)
      } else {
        // 找到父部门并添加为子节点
        const parentNode = treeMap.get(node.parentDepartmentId)
        if (parentNode) {
          if (!parentNode.children) {
            parentNode.children = []
          }
          parentNode.children.push(node)
          // 设置父部门名称
          node.parentDepartmentName = parentNode.departmentName
        } else {
          // 如果找不到父部门，作为顶级部门处理
          treeData.push(node)
        }
      }
    })
    
    // 为每个节点添加hasChildren属性
    const addHasChildren = (nodes: TreeNode[]) => {
      nodes.forEach(node => {
        node.hasChildren = node.children && node.children.length > 0
        if (node.children && node.children.length > 0) {
          addHasChildren(node.children)
        }
      })
    }
    
    // 按sortOrder排序
    const sortByOrder = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => a.sortOrder - b.sortOrder)
      nodes.forEach(node => {
        if (node.children && node.children.length > 0) {
          sortByOrder(node.children)
        }
      })
    }
    
    sortByOrder(treeData)
    addHasChildren(treeData)
    deptTreeData.value = treeData
    deptTreeTableData.value = treeData
  } catch (error) {
    console.error('获取部门列表失败:', error)
    ElMessage.error('获取部门列表失败')
  } finally {
    loading.value = false
  }
}

// 获取部门负责人列表
const getLeaderList = async () => {
  try {
    const response = await deptApi.getDeptLeaderList()
    leaderList.value = response.data
  } catch (error) {
    console.error('获取部门负责人列表失败:', error)
    ElMessage.error('获取部门负责人列表失败')
  }
}

// 行样式
const rowClassName = ({ row, rowIndex }: { row: Department; rowIndex: number }) => {
  if (row.status === '禁用') {
    return 'disabled-row'
  }
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  buildDeptTree()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.leaderId = ''
  searchForm.status = ''
  pagination.current = 1
  buildDeptTree()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  buildDeptTree()
}

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  buildDeptTree()
}

// 添加部门
const handleAdd = () => {
  ElMessage.info('新增部门')
}

// 查看部门
const handleView = (row: Department) => {
  deptDetail.value = row
  deptDetailDialogVisible.value = true
}

// 编辑部门
const handleEdit = (row: Department) => {
  ElMessage.info('编辑部门')
}

// 删除部门
const handleDelete = (row: Department) => {
  ElMessageBox.confirm(
    '确定要删除该部门吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    loading.value = true
    try {
      await deptApi.deleteDept(row.id)
      ElMessage.success('删除成功')
      // 重新获取部门列表
      await buildDeptTree()
    } catch (error) {
      console.error('删除部门失败:', error)
      ElMessage.error('删除部门失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 取消删除
  })
}

// 行点击事件，实现点击整行展开/折叠子部门
const handleRowClick = (row: TreeNode) => {
  if (tableRef.value) {
    tableRef.value.toggleRowExpansion(row)
  }
}

// 处理负责人点击事件
const leaderInfoDialogVisible = ref(false)
const leaderInfo = ref<any>(null)
const leaderInfoLoading = ref(false)

// 部门详情
const deptDetailDialogVisible = ref(false)
const deptDetail = ref<any>(null)

const handleLeaderClick = async (leaderId: string, leaderName: string) => {
  leaderInfoLoading.value = true
  try {
    // 这里应该调用后端接口获取用户信息
    // 暂时模拟数据，使用与用户管理模块一致的字段名
    leaderInfo.value = {
      id: leaderId,
      realName: leaderName,
      account: 'admin',
      phoneNumber: '13800138000',
      departmentName: '管理部门',
      roleName: '管理员',
      avatarUrl: ''
    }
    leaderInfoDialogVisible.value = true
  } catch (error) {
    console.error('获取用户信息失败:', error)
    ElMessage.error('获取用户信息失败')
  } finally {
    leaderInfoLoading.value = false
  }
}

// 新增部门相关
const addDialogVisible = ref(false)
const isChildDept = ref(false)
const parentDepartmentId = ref('')
const deptLeaderList = ref<Array<{ id: string; realName: string }>>([])
const leadersLoading = ref(false)
const rolesList = ref<Array<{ id: string; roleName: string }>>([])
const rolesLoading = ref(false)

const addForm = reactive({
  departmentName: '',
  roleId: '',
  leaderId: ''
})

const addFormRef = ref()
const addFormRules = reactive({
  departmentName: [
    { required: true, message: '请输入部门名称', trigger: 'blur' },
    { min: 2, max: 20, message: '部门名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  roleId: [
    { required: true, message: '请选择领导角色', trigger: 'change' }
  ],
  leaderId: [
    { required: true, message: '请选择部门负责人', trigger: 'change' }
  ]
})

// 获取角色列表
const getRolesList = async () => {
  rolesLoading.value = true
  try {
    const response = await roleApi.getLeaderRoleSelectList()
    rolesList.value = response.data
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    rolesLoading.value = false
  }
}

// 处理角色变化，获取对应角色的用户
const handleRoleChange = async (roleId: string) => {
  if (!roleId) {
    deptLeaderList.value = []
    addForm.leaderId = ''
    return
  }

  leadersLoading.value = true
  try {
    const response = await deptApi.getUserByRole(roleId)
    deptLeaderList.value = response.data
    addForm.leaderId = ''
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    leadersLoading.value = false
  }
}

// 新增顶级部门
const handleAddTopLevelDept = async () => {
  isChildDept.value = false
  parentDepartmentId.value = ''
  // 重置表单
  addForm.departmentName = ''
  addForm.roleId = ''
  addForm.leaderId = ''
  deptLeaderList.value = []
  // 获取角色列表
  await getRolesList()
  addDialogVisible.value = true
}

// 新增子部门
const handleAddChildDept = async (row: TreeNode) => {
  isChildDept.value = true
  parentDepartmentId.value = row.id
  // 重置表单
  addForm.departmentName = ''
  addForm.roleId = ''
  addForm.leaderId = ''
  deptLeaderList.value = []
  // 获取角色列表
  await getRolesList()
  addDialogVisible.value = true
}

// 提交新增部门
const submitAddForm = async () => {
  if (!addFormRef.value) return
  
  try {
    await addFormRef.value.validate()
    
    // 构建请求参数
    const params: any = {
      departmentName: addForm.departmentName,
      leaderId: addForm.leaderId
    }
    
    // 如果是子部门，添加父部门ID
    if (isChildDept.value && parentDepartmentId.value) {
      params.parentDepartmentId = parentDepartmentId.value
    }
    
    // 调用后端接口
    const response = await deptApi.addDept(params)
    
    ElMessage.success('新增部门成功')
    addDialogVisible.value = false
    // 重新获取部门列表
    buildDeptTree()
  } catch (error: any) {
    console.error('新增部门失败:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('新增部门失败')
    }
  }
}

// 页面加载时获取数据
onMounted(async () => {
  await getLeaderList()
  await buildDeptTree()
})
</script>

<style scoped lang="scss">
.dept-list-container {

  .search-form {
    :deep(.el-select) {
      :deep(.el-select__placeholder) {
        color: #606266;
      }
      
      :deep(.el-select__input) {
        color: #303133;
      }
      
      :deep(.el-select-dropdown__item) {
        color: #303133;
        
        &:hover {
          color: #409eff;
        }
      }
    }
  }

  .page-header {
    margin-bottom: 32px;
    animation: fadeInUp 0.5s ease-out;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      padding: 32px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(26, 26, 46, 0.15);

      .header-left {
        display: flex;
        align-items: center;
        gap: 20px;

        .header-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
          color: #fff;
        }

        .header-text {
          .page-title {
            font-size: 32px;
            font-weight: 700;
            color: #fff;
            margin: 0 0 8px 0;
          }

          .page-subtitle {
            font-size: 14px;
            color: rgba(255, 255, 255, 0.7);
            margin: 0;
          }
        }
      }

      .header-stats {
        display: flex;
        gap: 32px;

        .stat-item {
          text-align: center;
          padding: 16px 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          min-width: 100px;

          .stat-number {
            font-size: 24px;
            font-weight: 700;
            color: #e94560;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.7);
          }
        }
      }
    }
  }

  .search-filter {
    margin-bottom: 24px;

    .filter-card {
      border-radius: 12px;
      border: none;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;

      &:hover {
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      }
    }

    .search-form {
      :deep(.el-form-item) {
        margin-right: 16px;
        margin-bottom: 0;
      }

      .filter-input {
        border-radius: 8px;
      }

      .filter-select {
        width: 120px;
        border-radius: 8px;
      }

      .search-button {
        border-radius: 8px;
        margin-right: 8px;
      }

      .reset-button {
        border-radius: 8px;
      }
    }
  }

  .data-card {
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;
      padding: 16px 24px;
      border-bottom: 1px solid #f0f2f5;

      .header-title {
        font-size: 18px;
        font-weight: 600;
      }

      .add-button {
        border-radius: 8px;
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        border: none;

        &:hover {
          background: linear-gradient(135deg, #ff6b6b 0%, #e94560 100%);
        }
      }

      .add-child-button {
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }
    }

    .dept-table {
      border-radius: 8px;
      overflow: hidden;
      width: 100% !important;

      :deep(.el-table__header-wrapper) {
        background: #f8fafc;

        th {
          font-weight: 600;
          color: #1a1a2e;
          background: #f8fafc !important;
          text-align: center !important;
          white-space: nowrap;
        }
      }

      :deep(.el-table__body-wrapper) {
        .even-row {
          background: #f8fafc;
        }

        .odd-row {
          background: #fff;
        }

        tr.disabled-row {
          background: rgba(245, 108, 108, 0.15) !important;
          border-left: 4px solid #f56c6c !important;
        }

        tr.disabled-row td {
          background: rgba(245, 108, 108, 0.15) !important;
        }

        .status-icon {
          margin-right: 4px;
        }

        .status-tag {
          font-size: 12px;
          color: #f56c6c;
          margin-left: 4px;
        }

        tr {
          transition: all 0.3s ease;

          &:hover {
            background: rgba(233, 69, 96, 0.05) !important;
          }
        }

        td {
          text-align: center !important;
          white-space: nowrap;
          padding: 12px 0;
          cursor: pointer;
        }

        .el-table__expand-icon {
          cursor: pointer;
        }
      }

      :deep(.el-table__column) {
        flex: 1;
        min-width: 100px;
      }

      .action-buttons {
        display: flex;
        justify-content: center;
        gap: 12px;
      }

      .action-button {
        border-radius: 6px;
        transition: all 0.3s ease;

        &:hover {
          transform: translateY(-2px);
        }
      }

      .stat-box {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 12px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;

        &:hover {
          transform: scale(1.05);
        }

        .stat-icon {
          font-size: 16px;
        }

        &.user-count {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
        }

        &.total-risk {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          color: #fff;
        }

        &.closed-risk {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
          color: #fff;
        }

        &.pending-risk {
          background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
          color: #fff;
        }
      }

      .leader-link,
      .department-link {
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
        position: relative;
        padding: 4px 8px;
        border-radius: 6px;
        display: inline-block;

        &:hover {
          color: #409eff;
          background: rgba(64, 158, 255, 0.1);
          transform: scale(1.05);
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
        }

        &.disabled-department {
          color: #f56c6c !important;
          font-weight: 700;
          text-decoration: line-through;

          &:hover {
            color: #f56c6c !important;
            background: rgba(245, 108, 108, 0.1);
            box-shadow: 0 2px 8px rgba(245, 108, 108, 0.3);
          }
        }
      }

      .leader-info-dialog {
        .el-dialog__body {
          padding: 24px;
        }
      }

      .leader-info-container {
        .leader-header {
          display: flex;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e4e7ed;

          .leader-avatar {
            margin-right: 20px;
            .el-avatar {
              background: #409eff;
            }
          }

          .leader-basic-info {
            .leader-name {
              margin: 0 0 8px 0;
              font-size: 20px;
              font-weight: 600;
              color: #303133;
            }

            .leader-role {
              margin: 0;
              font-size: 14px;
              color: #606266;
            }
          }
        }

        .leader-details {
          margin-top: 20px;

          :deep(.el-descriptions__label) {
            font-weight: 600;
            color: #606266;
          }

          :deep(.el-descriptions__content) {
            color: #303133;
          }
        }
      }

      .dept-detail-dialog {
        .el-dialog__body {
          padding: 24px;
        }
      }

      .dept-detail-container {
        .dept-header {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e4e7ed;

          .dept-info {
            .dept-name {
              margin: 0 0 12px 0;
              font-size: 20px;
              font-weight: 600;
              color: #303133;
            }

            .dept-meta {
              display: flex;
              align-items: center;
              gap: 16px;

              .dept-id {
                font-size: 14px;
                color: #606266;
              }
            }
          }
        }

        .dept-stats {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;

          .stat-item {
            flex: 1;
            text-align: center;
            padding: 16px;
            background: #f8fafc;
            border-radius: 8px;
            transition: all 0.3s ease;

            &:hover {
              background: #ecf5ff;
            }

            .stat-icon {
              width: 40px;
              height: 40px;
              margin: 0 auto 8px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 18px;

              &.user-icon {
                background: #ecf5ff;
                color: #409eff;
              }

              &.risk-icon {
                background: #fef0f0;
                color: #f56c6c;
              }

              &.closed-icon {
                background: #f0f9eb;
                color: #67c23a;
              }

              &.pending-icon {
                background: #fdf6ec;
                color: #e6a23c;
              }
            }

            .stat-number {
              font-size: 20px;
              font-weight: 600;
              color: #303133;
              margin-bottom: 4px;
            }

            .stat-label {
              font-size: 12px;
              color: #606266;
            }
          }
        }

        .dept-details {
          margin-top: 20px;

          :deep(.el-descriptions__label) {
            font-weight: 600;
            color: #606266;
          }

          :deep(.el-descriptions__content) {
            color: #303133;
          }
        }
      }
    }

    .pagination {
      margin-top: 24px;
      display: flex;
      justify-content: flex-end;

      .custom-pagination {
        :deep(.el-pagination__sizes) {
          margin-right: 16px;
        }

        :deep(.el-pagination__jump) {
          margin-left: 16px;
        }

        :deep(.el-pagination__button) {
          border-radius: 6px;
        }

        :deep(.el-pagination__button.is-active) {
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          border-color: #e94560;
        }
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

// 响应式设计
@media (max-width: 768px) {
  .dept-list-container {
    .page-header {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 24px;

        .header-stats {
          width: 100%;
          justify-content: space-around;
        }
      }
    }

    .search-filter {
      .search-form {
        flex-wrap: wrap;

        :deep(.el-form-item) {
          margin-bottom: 12px;
        }

        .filter-input,
        .filter-select {
          width: 100%;
        }
      }
    }

    .data-card {
      .dept-table {
        :deep(.el-table__body-wrapper) {
          .action-button {
            margin-right: 4px;
            font-size: 12px;
            padding: 4px 8px;
          }
        }
      }
    }
  }
}
</style>