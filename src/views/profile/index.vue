<template>
  <div class="profile-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">个人中心</h1>
      <p class="page-subtitle">查看和编辑个人信息</p>
    </div>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="profile-card" shadow="hover">
          <div class="profile-header">
            <el-avatar :size="120" :icon="UserFilled" class="profile-avatar" />
            <h3 class="profile-name">{{ userStore.userInfo?.realName || userStore.userInfo?.account || '管理员' }}</h3>
            <p class="profile-role">{{ userStore.userInfo?.roleName || 'ADMIN' }}</p>
            <p class="profile-department">{{ userStore.userInfo?.departmentName || '没有部门' }}</p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>{{ userStore.userInfo?.phoneNumber || '15347758353' }}</span>
            </div>
            <div class="info-item">
              <el-icon><User /></el-icon>
              <span>{{ userStore.userInfo?.account || 'admin' }}</span>
            </div>
            <div class="info-item">
              <el-icon><Key /></el-icon>
              <span>ID: {{ userStore.userInfo?.id || '2036347045152862209' }}</span>
            </div>
          </div>
          <div class="profile-actions">
            <el-button type="primary" size="large" class="action-btn">
              <el-icon><Edit /></el-icon>
              编辑资料
            </el-button>
            <el-button size="large" class="action-btn">
              <el-icon><RefreshLeft /></el-icon>
              刷新信息
            </el-button>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="16">
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Document /></el-icon>
              <span>详细信息</span>
            </div>
          </template>
          <el-form :model="profileForm" label-width="120px">
            <el-form-item label="真实姓名">
              <el-input v-model="profileForm.realName" disabled />
            </el-form-item>
            <el-form-item label="账号">
              <el-input v-model="profileForm.account" disabled />
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="profileForm.phoneNumber" disabled />
            </el-form-item>
            <el-form-item label="部门">
              <el-input v-model="profileForm.departmentName" disabled />
            </el-form-item>
            <el-form-item label="角色">
              <el-input v-model="profileForm.roleName" disabled />
            </el-form-item>
            <el-form-item label="用户ID">
              <el-input v-model="profileForm.id" disabled />
            </el-form-item>
            <el-form-item label="登录时间">
              <el-input v-model="loginTime" disabled />
            </el-form-item>
          </el-form>
        </el-card>

        <el-card class="security-card" shadow="hover" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <el-icon><Lock /></el-icon>
              <span>安全设置</span>
            </div>
          </template>
          <div class="security-options">
            <div class="option-item">
              <div class="option-info">
                <h4>修改密码</h4>
                <p>定期修改密码可以提高账户安全性</p>
              </div>
              <el-button type="primary">修改</el-button>
            </div>
            <div class="option-item">
              <div class="option-info">
                <h4>绑定手机</h4>
                <p>绑定手机可以接收安全通知</p>
              </div>
              <el-button>绑定</el-button>
            </div>
            <div class="option-item">
              <div class="option-info">
                <h4>登录记录</h4>
                <p>查看最近的登录记录</p>
              </div>
              <el-button>查看</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useUserStore } from '@/stores'
import { 
  UserFilled, 
  Phone, 
  User, 
  Key, 
  Edit, 
  RefreshLeft, 
  Document, 
  Lock 
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// 计算当前登录时间
const loginTime = ref(new Date().toLocaleString('zh-CN'))

// 个人信息表单
const profileForm = reactive({
  id: userStore.userInfo?.id || '2036347045152862209',
  account: userStore.userInfo?.account || 'admin',
  realName: userStore.userInfo?.realName || 'zyj',
  phoneNumber: userStore.userInfo?.phoneNumber || '15347758353',
  departmentName: userStore.userInfo?.departmentName || '没有部门',
  roleName: userStore.userInfo?.roleName || 'ADMIN'
})
</script>

<style scoped lang="scss">
.profile-container {
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

  .profile-card {
    border-radius: 16px;
    border: none;
    text-align: center;

    :deep(.el-card__body) {
      padding: 30px;
    }

    .profile-header {
      margin-bottom: 24px;

      .profile-avatar {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        margin: 0 auto 16px;
      }

      .profile-name {
        font-size: 20px;
        font-weight: 600;
        color: #1a1a2e;
        margin: 0 0 8px 0;
      }

      .profile-role {
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 4px 0;
      }

      .profile-department {
        font-size: 13px;
        color: #9ca3af;
        margin: 0;
      }
    }

    .profile-info {
      margin-bottom: 24px;
      padding: 20px;
      background: #f8fafc;
      border-radius: 12px;

      .info-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 0;
        border-bottom: 1px solid #e2e8f0;

        &:last-child {
          border-bottom: none;
        }

        .el-icon {
          color: #409eff;
          font-size: 16px;
        }

        span {
          font-size: 14px;
          color: #4b5563;
        }
      }
    }

    .profile-actions {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .action-btn {
        width: 100%;
        border-radius: 8px;

        .el-icon {
          margin-right: 6px;
        }
      }
    }
  }

  .info-card {
    border-radius: 16px;
    border: none;

    :deep(.el-card__header) {
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
    }

    :deep(.el-card__body) {
      padding: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;

      .el-icon {
        color: #667eea;
      }
    }

    :deep(.el-form-item) {
      margin-bottom: 16px;

      :deep(.el-input__wrapper) {
        border-radius: 8px;
      }
    }
  }

  .security-card {
    border-radius: 16px;
    border: none;

    :deep(.el-card__header) {
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
    }

    :deep(.el-card__body) {
      padding: 24px;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 16px;
      font-weight: 600;
      color: #1a1a2e;

      .el-icon {
        color: #f59e0b;
      }
    }

    .security-options {
      .option-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 0;
        border-bottom: 1px solid #f3f4f6;

        &:last-child {
          border-bottom: none;
        }

        .option-info {
          h4 {
            font-size: 15px;
            font-weight: 600;
            color: #1a1a2e;
            margin: 0 0 4px 0;
          }

          p {
            font-size: 13px;
            color: #6b7280;
            margin: 0;
          }
        }
      }
    }
  }
}
</style>
