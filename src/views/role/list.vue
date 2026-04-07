<template>
  <div class="role-list-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-icon">
            <el-icon :size="32"><Position /></el-icon>
          </div>
          <div class="header-text">
            <h1 class="page-title">角色管理</h1>
            <p class="page-subtitle">管理系统角色信息，包括角色名称和权限等信息</p>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-number">{{ roleList.length }}</div>
            <div class="stat-label">角色数量</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据表格 -->
    <el-card shadow="hover" class="data-card">
      <template #header>
        <div class="card-header">
          <span class="header-title">角色列表</span>
          <el-button type="primary" @click="handleAdd" class="add-button">
            <el-icon><Plus /></el-icon>
            新增角色
          </el-button>
        </div>
      </template>
      <el-table
        v-loading="loading"
        :data="roleList"
        style="width: 100%"
        class="role-table"
        :row-class-name="rowClassName"
        stripe
        border
      >
        <el-table-column prop="id" label="ID" align="center" />
        <el-table-column prop="roleName" label="角色名称" align="center">
          <template #default="{ row }">
            <el-tag size="small" :type="row.roleName === '管理员' ? 'danger' : 'success'">
              {{ row.roleName === '管理员' ? '管理员' : row.roleName }}
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
    </el-card>

    <!-- 新增角色对话框 -->
    <el-dialog
      v-model="addDialogVisible"
      title="新增角色"
      width="400px"
      center
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="80px"
        class="add-role-form"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName" placeholder="请输入角色名称" @input="addForm.roleCode = generateRoleCode(addForm.roleName)" />
        </el-form-item>
        <el-form-item label="角色代码" prop="roleCode">
          <el-input v-model="addForm.roleCode" placeholder="请输入角色代码（全大写，下划线分割）" />
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
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  View, 
  Edit, 
  Position,
  Plus,
  Delete
} from '@element-plus/icons-vue'
import { roleApi } from '@/api/role'
import { useUserStore } from '@/stores'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const roleList = ref<Array<{
  id: string
  roleName: string
}>>([])

// 新增角色对话框
const addDialogVisible = ref(false)
const addForm = reactive({
  roleName: '',
  roleCode: ''
})
const addFormRef = ref()
const addFormRules = reactive({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '角色名称长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  roleCode: [
    { required: true, message: '请输入角色代码', trigger: 'blur' },
    { pattern: /^[A-Z_]+$/, message: '角色代码必须全大写且使用下划线分割', trigger: 'blur' }
  ]
})

// 生成角色代码
const generateRoleCode = (name: string) => {
  return name
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '_')
    .replace(/[^A-Z0-9_]/g, '_')
}

// 行样式
const rowClassName = ({ row, rowIndex }: { row: any; rowIndex: number }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row'
}

// 获取角色列表
const getRoleList = async () => {
  loading.value = true
  try {
    const response = await roleApi.getRoleSelectList()
    roleList.value = response.data
  } catch (error) {
    console.error('获取角色列表失败:', error)
    ElMessage.error('获取角色列表失败')
  } finally {
    loading.value = false
  }
}

// 查看角色
const handleView = (row: any) => {
  ElMessage.info('查看角色详情')
}

// 编辑角色
const handleEdit = (row: any) => {
  ElMessage.info('编辑角色')
}

// 删除角色
const handleDelete = async (row: any) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该角色吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 调用后端接口
    const response = await roleApi.deleteRole(row.id)
    
    ElMessage.success('删除角色成功')
    getRoleList()
  } catch (error: any) {
    if (error === 'cancel') return
    console.error('删除角色失败:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('删除角色失败')
    }
  }
}

// 添加角色
const handleAdd = () => {
  // 重置表单
  addForm.roleName = ''
  addForm.roleCode = ''
  addDialogVisible.value = true
}

// 提交新增角色
const submitAddForm = async () => {
  if (!addFormRef.value) return
  
  try {
    await addFormRef.value.validate()
    
    // 调用后端接口
    const response = await roleApi.addRole({
      roleName: addForm.roleName,
      roleCode: addForm.roleCode
    })
    
    ElMessage.success('新增角色成功')
    addDialogVisible.value = false
    getRoleList()
  } catch (error: any) {
    console.error('新增角色失败:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('新增角色失败')
    }
  }
}

// 页面加载时获取数据
onMounted(() => {
  getRoleList()
})
</script>

<style scoped lang="scss">
.role-list-container {
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

    .role-table {
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

// 新增角色表单样式
.add-role-form {
  margin-top: 20px;
}

// 响应式设计
@media (max-width: 768px) {
  .role-list-container {
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

    .data-card {
      .role-table {
        :deep(.el-table__body-wrapper) {
          .action-button {
            margin-right: 4px;
            font-size: 12px;
            padding: 4px 8px;
          }
        }
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
  }
}
</style>