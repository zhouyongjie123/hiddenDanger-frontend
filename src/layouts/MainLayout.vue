<template>
  <el-container class="main-layout">
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '200px'" class="sidebar">
      <div class="logo">
        <el-icon :size="24"><Monitor /></el-icon>
        <span v-show="!appStore.sidebarCollapsed">管理系统</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>首页</template>
        </el-menu-item>
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <template #title>关于</template>
        </el-menu-item>
        <el-menu-item index="/profile">
          <el-icon><UserFilled /></el-icon>
          <template #title>个人中心</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="appStore.toggleSidebar">
            <Fold v-if="!appStore.sidebarCollapsed" />
            <Expand v-else />
          </el-icon>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled as any" />
              <span class="username">{{ userStore.userInfo?.username || '管理员' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人中心</el-dropdown-item>
                <el-dropdown-item command="settings">系统设置</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAppStore, useUserStore } from '@/stores'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      break
    case 'logout':
      userStore.clearToken()
      router.push('/login')
      break
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;

  .sidebar {
    background-color: #304156;
    transition: width 0.3s;

    .logo {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border-bottom: 1px solid #1f2d3d;

      .el-icon {
        margin-right: 8px;
      }
    }

    .el-menu {
      border-right: none;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

    .header-left {
      display: flex;
      align-items: center;

      .collapse-btn {
        font-size: 20px;
        cursor: pointer;
        margin-right: 15px;

        &:hover {
          color: #409EFF;
        }
      }
    }

    .header-right {
      .user-info {
        display: flex;
        align-items: center;
        cursor: pointer;

        .username {
          margin: 0 8px;
          font-size: 14px;
        }
      }
    }
  }

  .main-content {
    background-color: #f0f2f5;
    padding: 20px;
    overflow-y: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
