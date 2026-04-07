<template>
  <div class="user-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <el-icon :size="32"><UserIcon /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">用户管理</h1>
            <p class="page-subtitle">管理系统用户信息，包括账号、角色和部门等信息</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ userList.length }}</div>
            <div class="stat-label">当前显示</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ totalUsers }}</div>
            <div class="stat-label">总用户数</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="search-filter">
      <el-card shadow="hover" class="filter-card">
        <el-form :inline="true" :model="searchForm" class="search-form">
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
          <el-form-item label="角色">
            <el-select v-model="searchForm.roleId" placeholder="请选择角色" class="filter-select">
              <el-option label="全部角色" value="" />
              <el-option 
                v-for="role in roleList" 
                :key="role.id" 
                :label="role.roleName === '管理员' ? '管理员' : role.roleName" 
                :value="role.id"
              />
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

    <!-- 数据表格 -->
    <el-card shadow="hover" class="data-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">用户列表</span>
          <el-button v-if="userStore.userInfo?.roleName === '管理员'" type="primary" @click="handleAdd" class="add-button">
            <el-icon><Plus /></el-icon>
            新增用户
          </el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
        class="user-table"
        :row-class-name="rowClassName"
        stripe
        border
      >
        <el-table-column label="头像" align="center" width="80">
          <template #default="{ row }">
            <el-avatar :size="32" :src="row.avatarUrl || undefined" :icon="UserFilled" class="user-avatar" />
          </template>
        </el-table-column>
        <el-table-column prop="account" label="账号" align="center" />
        <el-table-column prop="realName" label="姓名" align="center" />
        <el-table-column prop="phoneNumber" label="手机号" align="center" />
        <el-table-column prop="departmentName" label="部门" align="center">
          <template #default="{ row }">
            <el-tag size="small" effect="plain" class="department-tag">
              {{ row.departmentName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.roleName === '管理员' ? 'danger' : 'success'" class="role-tag">
              {{ row.roleName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button size="small" @click="handleView(row)" class="action-button view-button">
                <el-icon><View /></el-icon>
                查看
              </el-button>
              <el-button size="small" type="primary" @click="handleEdit(row)" class="action-button edit-button">
                <el-icon><Edit /></el-icon>
                编辑
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

    <!-- 新增用户对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增用户"
      width="600px"
      center
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="100px"
        class="add-user-form"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="addForm.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="false">
          <el-input v-model="addForm.password" type="password" placeholder="请输入密码（选填）" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="addForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="addForm.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="addForm.departmentId" placeholder="请选择部门">
            <el-option
              v-for="dept in deptTree"
              :key="dept.id"
              :label="dept.departmentName"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="addForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName === '管理员' ? '管理员' : role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" :required="false">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleAvatarUpload"
            :auto-upload="false"
          >
            <el-avatar :size="100" :src="avatarUrl || addForm.avatarUrl" :icon="UserFilled">
              <template #default>
                <ElIcon class="avatar-uploader-icon"><Plus /></ElIcon>
              </template>
            </el-avatar>
          </el-upload>
          <div class="upload-tip">点击上传头像（选填）</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitAddForm">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑用户对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑用户"
      width="600px"
      center
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="100px"
        class="add-user-form"
      >
        <el-form-item label="账号" prop="account">
          <el-input v-model="editForm.account" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码" prop="password" :required="false">
          <el-input v-model="editForm.password" type="password" placeholder="请输入密码（选填）" show-password />
        </el-form-item>
        <el-form-item label="姓名" prop="realName">
          <el-input v-model="editForm.realName" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phoneNumber">
          <el-input v-model="editForm.phoneNumber" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="部门" prop="departmentId">
          <el-select v-model="editForm.departmentId" placeholder="请选择部门">
            <el-option
              v-for="dept in deptTree"
              :key="dept.id"
              :label="dept.departmentName"
              :value="dept.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="editForm.roleId" placeholder="请选择角色">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.roleName === '管理员' ? '管理员' : role.roleName"
              :value="role.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="头像" :required="false">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="handleAvatarUpload"
            :auto-upload="false"
          >
            <el-avatar :size="100" :src="editAvatarUrl || editForm.avatarUrl" :icon="UserFilled">
              <template #default>
                <ElIcon class="avatar-uploader-icon"><Plus /></ElIcon>
              </template>
            </el-avatar>
          </el-upload>
          <div class="upload-tip">点击上传头像（选填）</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitEditForm">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElUpload, ElButton, ElIcon, ElTooltip, ElRadio, ElRadioGroup, ElRadioButton } from 'element-plus'
import { 
  Search, 
  Plus, 
  View, 
  Edit, 
  Delete, 
  User as UserIcon, 
  UserFilled, 
  Refresh 
} from '@element-plus/icons-vue'
import { userApi } from '@/api/user'
import { deptApi } from '@/api/dept'
import { roleApi } from '@/api/role'
import { useUserStore } from '@/stores'
import type { UserListResponse, User } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const userList = ref<User[]>([])

// 新增用户对话框
const addDialogVisible = ref(false)
const addForm = reactive({
  account: '',
  password: '',
  realName: '',
  phoneNumber: '',
  departmentId: '',
  roleId: '',
  avatarUrl: ''
})
const addFormRef = ref()
const addFormRules = reactive({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 编辑用户对话框
const editDialogVisible = ref(false)
const editForm = reactive({
  id: '',
  account: '',
  password: '',
  realName: '',
  phoneNumber: '',
  departmentId: '',
  roleId: '',
  avatarUrl: ''
})
const editFormRef = ref()
const editFormRules = reactive({
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择部门', trigger: 'change' }
  ],
  roleId: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
})

// 头像上传
const avatarUrl = ref('')
const editAvatarUrl = ref('')
const handleAvatarUpload = (file) => {
  // 后期对接上传接口
  ElMessage.info('头像上传功能待实现')
  return false
}
const deptList = ref<Array<{
  id: string
  departmentName: string
  status: string
  parentDepartmentName: string
  departmentPath: string
  leaderName: string
  leaderId: string
  sortOrder: number
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
const roleList = ref<Array<{
  id: string
  roleName: string
}>>([])

// 搜索表单
const searchForm = reactive({
  departmentId: '',
  roleId: ''
})

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 总用户数（所有用户）
const totalUsers = ref(0)

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

// 行样式
const rowClassName = ({ row, rowIndex }: { row: User; rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const response = await userApi.getUserList({
      current: pagination.current,
      pageSize: pagination.pageSize,
      departmentId: searchForm.departmentId,
      roleId: searchForm.roleId
    })
    userList.value = response.data
    pagination.total = response.total || 0
    
    // 只在首次加载或未筛选时更新总用户数
    if (!searchForm.departmentId && !searchForm.roleId) {
      totalUsers.value = response.total || 0
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取总用户数（初始加载）
const getTotalUsers = async () => {
  try {
    const response = await userApi.getUserList({
      current: 1,
      pageSize: 1,
      departmentId: '',
      roleId: ''
    })
    totalUsers.value = response.total || 0
  } catch (error) {
    console.error('获取总用户数失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.current = 1
  getUserList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.departmentId = ''
  searchForm.roleId = ''
  pagination.current = 1
  getUserList()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  getUserList()
}

// 页码变化
const handleCurrentChange = (current: number) => {
  pagination.current = current
  getUserList()
}

// 添加用户
const handleAdd = () => {
  // 重置表单
  Object.keys(addForm).forEach(key => {
    addForm[key] = ''
  })
  avatarUrl.value = ''
  addDialogVisible.value = true
}

// 提交新增用户
const submitAddForm = async () => {
  if (!addFormRef.value) return
  
  try {
    await addFormRef.value.validate()
    
    // 构建请求参数
    const requestData = {
      account: addForm.account,
      realName: addForm.realName,
      phoneNumber: addForm.phoneNumber,
      departmentId: addForm.departmentId,
      roleId: addForm.roleId
    }
    
    // 可选参数
    if (addForm.password) {
      requestData.password = addForm.password
    }
    if (addForm.avatarUrl) {
      requestData.avatarUrl = addForm.avatarUrl
    }
    
    // 调用后端接口
    const response = await userApi.register(requestData)
    
    ElMessage.success('新增用户成功')
    addDialogVisible.value = false
    getUserList()
  } catch (error) {
    console.error('新增用户失败:', error)
    ElMessage.error('新增用户失败')
  }
}

// 查看用户
const handleView = (row: User) => {
  ElMessage.info('查看用户详情')
}

// 编辑用户
const handleEdit = (row: User) => {
  // 填充表单数据
  editForm.id = row.id
  editForm.account = row.account
  editForm.realName = row.realName
  editForm.phoneNumber = row.phoneNumber
  editForm.departmentId = row.departmentId
  editForm.roleId = row.roleId
  editForm.avatarUrl = row.avatarUrl
  editForm.password = '' // 密码为空，需要用户重新输入
  editAvatarUrl.value = ''
  editDialogVisible.value = true
}

// 提交编辑用户
const submitEditForm = async () => {
  if (!editFormRef.value) return
  
  try {
    await editFormRef.value.validate()
    
    // 构建请求参数
    const requestData: any = {
      id: editForm.id
    }
    
    // 只包含非空字段
    if (editForm.account) requestData.account = editForm.account
    if (editForm.password) requestData.password = editForm.password
    if (editForm.realName) requestData.realName = editForm.realName
    if (editForm.phoneNumber) requestData.phoneNumber = editForm.phoneNumber
    if (editForm.departmentId) requestData.departmentId = editForm.departmentId
    if (editForm.roleId) requestData.roleId = editForm.roleId
    if (editForm.avatarUrl) requestData.avatarUrl = editForm.avatarUrl
    
    // 调用后端接口
    const response = await userApi.updateUser(requestData)
    
    ElMessage.success('编辑用户成功')
    editDialogVisible.value = false
    getUserList()
  } catch (error) {
    console.error('编辑用户失败:', error)
    ElMessage.error('编辑用户失败')
  }
}

// 删除用户
const handleDelete = (row: User) => {
  ElMessageBox.confirm(
    '确定要删除该用户吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    loading.value = true
    try {
      await userApi.deleteUser(row.id)
      ElMessage.success('删除成功')
      getUserList()
    } catch (error) {
      console.error('删除用户失败:', error)
      ElMessage.error('删除用户失败')
    } finally {
      loading.value = false
    }
  }).catch(() => {
    // 取消删除
  })
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

// 获取角色列表
const getRoleList = async () => {
  try {
    const response = await roleApi.getRoleSelectList()
    roleList.value = response.data
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  }
}

// 页面加载时获取数据
onMounted(() => {
  getDeptList()
  getRoleList()
  getTotalUsers()
  getUserList()
})
</script>

<style scoped lang="scss">
.user-list-container {
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

      .filter-select {
        width: 180px;
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
    }

    .user-table {
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

        tr {
          transition: all 0.3s ease;

          &:hover {
            background: rgba(233, 69, 96, 0.05) !important;
          }
        }

        td {
          text-align: center !important;
          white-space: nowrap;
        }
      }

      :deep(.el-table__column) {
        flex: 1;
        min-width: 100px;
      }

      .account-info {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;

        .user-avatar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .account-text {
          font-weight: 500;
          color: #1a1a2e;
        }
      }

      .department-tag {
        border-radius: 12px;
        font-size: 12px;
      }

      .role-tag {
        border-radius: 12px;
        font-size: 12px;
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

// 新增用户表单样式
.add-user-form {
  .avatar-uploader {
    margin-bottom: 12px;
  }
  
  .avatar-uploader-icon {
    font-size: 32px;
    color: #999;
  }
  
  .upload-tip {
    font-size: 12px;
    color: #909399;
    margin-top: 8px;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-list-container {
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

        .filter-select {
          width: 100%;
        }
      }
    }

    .data-card {
      .user-table {
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
