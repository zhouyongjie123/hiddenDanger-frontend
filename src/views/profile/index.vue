<template>
  <div class="profile-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="profile-header">
            <el-avatar :size="100" :icon="UserFilled" />
            <h3>{{ userStore.userInfo?.username || '管理员' }}</h3>
            <p>前端开发工程师</p>
          </div>
          <div class="profile-info">
            <div class="info-item">
              <el-icon><Message /></el-icon>
              <span>admin@example.com</span>
            </div>
            <div class="info-item">
              <el-icon><Phone /></el-icon>
              <span>138****8888</span>
            </div>
            <div class="info-item">
              <el-icon><Location /></el-icon>
              <span>北京市朝阳区</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>基本资料</span>
            </div>
          </template>
          <el-form :model="profileForm" label-width="100px">
            <el-form-item label="用户名">
              <el-input v-model="profileForm.username" disabled />
            </el-form-item>
            <el-form-item label="昵称">
              <el-input v-model="profileForm.nickname" />
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="profileForm.email" />
            </el-form-item>
            <el-form-item label="手机">
              <el-input v-model="profileForm.phone" />
            </el-form-item>
            <el-form-item label="个人简介">
              <el-input
                v-model="profileForm.bio"
                type="textarea"
                :rows="4"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveProfile">保存修改</el-button>
              <el-button @click="resetForm">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { UserFilled, Message, Phone, Location } from '@element-plus/icons-vue'
import { useUserStore } from '@/stores'

const userStore = useUserStore()

const profileForm = reactive({
  username: userStore.userInfo?.username || 'admin',
  nickname: '管理员',
  email: 'admin@example.com',
  phone: '13888888888',
  bio: '热爱前端开发，喜欢探索新技术。',
})

const saveProfile = () => {
  ElMessage.success('保存成功')
}

const resetForm = () => {
  profileForm.nickname = '管理员'
  profileForm.email = 'admin@example.com'
  profileForm.phone = '13888888888'
  profileForm.bio = '热爱前端开发，喜欢探索新技术。'
  ElMessage.info('已重置')
}
</script>

<style scoped lang="scss">
.profile-container {
  .profile-header {
    text-align: center;
    padding: 20px 0;

    h3 {
      margin: 15px 0 5px;
      color: #303133;
    }

    p {
      color: #909399;
      margin: 0;
    }
  }

  .profile-info {
    padding: 20px 0;
    border-top: 1px solid #ebeef5;

    .info-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      color: #606266;

      .el-icon {
        margin-right: 10px;
        color: #409EFF;
      }
    }
  }

  .card-header {
    font-weight: bold;
  }
}
</style>
