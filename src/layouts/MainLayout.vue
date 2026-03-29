<template>
  <el-container class="main-layout">
    <el-aside :width="appStore.sidebarCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <div class="logo-icon">
          <el-icon :size="28"><FirstAidKit /></el-icon>
        </div>
        <span v-show="!appStore.sidebarCollapsed" class="logo-text">煤矿隐患管理</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="appStore.sidebarCollapsed"
        :collapse-transition="false"
        router
        class="custom-menu"
      >
        <el-menu-item index="/home">
          <el-icon><HomeFilled /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>
        
        <el-sub-menu index="/danger">
          <template #title>
            <el-icon><Warning /></el-icon>
            <span>隐患管理</span>
          </template>
          <el-menu-item index="/danger">隐患列表</el-menu-item>
          <el-menu-item index="/danger/report">隐患上报</el-menu-item>
          <el-menu-item index="/danger/track">整改跟踪</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="/inspect">
          <template #title>
            <el-icon><Search /></el-icon>
            <span>安全检查</span>
          </template>
          <el-menu-item index="/inspect/plan">检查计划</el-menu-item>
          <el-menu-item index="/inspect/record">检查记录</el-menu-item>
        </el-sub-menu>
        
        <el-sub-menu index="/analysis">
          <template #title>
            <el-icon><TrendCharts /></el-icon>
            <span>统计分析</span>
          </template>
          <el-menu-item index="/analysis/danger">隐患分析</el-menu-item>
          <el-menu-item index="/analysis/trend">趋势分析</el-menu-item>
        </el-sub-menu>
        
        <el-menu-item index="/about">
          <el-icon><InfoFilled /></el-icon>
          <template #title>关于系统</template>
        </el-menu-item>
      </el-menu>
      
      <!-- 侧边栏底部 -->
      <div class="sidebar-footer" v-show="!appStore.sidebarCollapsed">
        <div class="safety-slogan">
          <el-icon><CircleCheck /></el-icon>
          <span>安全生产 人人有责</span>
        </div>
      </div>
    </el-aside>
    
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <div class="collapse-btn" @click="appStore.toggleSidebar">
            <el-icon :size="20"><Fold v-if="!appStore.sidebarCollapsed" /><Expand v-else /></el-icon>
          </div>
          <breadcrumb />
        </div>
        <div class="header-right">
          <!-- 通知 -->
          <el-badge :value="3" class="notice-badge" type="danger">
            <el-icon :size="20" class="notice-icon"><Bell /></el-icon>
          </el-badge>
          
          <!-- 全屏 -->
          <el-icon :size="20" class="fullscreen-icon" @click="toggleFullscreen"><FullScreen /></el-icon>
          
          <!-- 用户下拉 -->
          <el-dropdown @command="handleCommand" class="user-dropdown">
            <div class="user-info">
              <el-avatar :size="36" :icon="UserFilled" class="user-avatar" />
              <div class="user-detail" v-if="!appStore.sidebarCollapsed">
                <span class="username">{{ userStore.userInfo?.realName || userStore.userInfo?.account || '管理员' }}</span>
                <span class="user-role">{{ userStore.userInfo?.departmentName || '安全管理员' }}</span>
              </div>
              <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><User /></el-icon>
                  个人中心
                </el-dropdown-item>
                <el-dropdown-item command="settings">
                  <el-icon><Setting /></el-icon>
                  系统设置
                </el-dropdown-item>
                <el-dropdown-item divided command="logout">
                  <el-icon><SwitchButton /></el-icon>
                  退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="main-content">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
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
import { authApi } from '@/api/auth'
import { ElMessage } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { 
  UserFilled, 
  User, 
  Setting, 
  SwitchButton,
  FirstAidKit,
  HomeFilled,
  Warning,
  Search,
  TrendCharts,
  InfoFilled,
  Bell,
  FullScreen,
  ArrowDown,
  Fold,
  Expand,
  CircleCheck
} from '@element-plus/icons-vue'

const router = useRouter()
const appStore = useAppStore()
const userStore = useUserStore()

const handleCommand = async (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      break
    case 'logout':
      try {
        // 调用后端退出登录接口
        await authApi.logout()
        // 清除本地token和用户信息
        userStore.clearToken()
        ElMessage.success('退出登录成功')
        router.push('/login')
      } catch (error) {
        console.error('退出登录失败:', error)
        // 即使后端接口失败，也要清除本地token和用户信息
        userStore.clearToken()
        router.push('/login')
      }
      break
  }
}

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;

  .sidebar {
    background: linear-gradient(180deg, #1a1a2e 0%, #16213e 100%);
    transition: width 0.3s;
    display: flex;
    flex-direction: column;

    .logo {
      height: 70px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);

      .logo-icon {
        width: 44px;
        height: 44px;
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
      }

      .logo-text {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
      }
    }

    .custom-menu {
      flex: 1;
      border-right: none;
      background: transparent;
      padding: 16px 12px;

      :deep(.el-menu-item),
      :deep(.el-sub-menu__title) {
        color: rgba(255, 255, 255, 0.7);
        height: 48px;
        line-height: 48px;
        border-radius: 8px;
        margin-bottom: 4px;

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
        }

        .el-icon {
          color: rgba(255, 255, 255, 0.7);
        }
      }

      :deep(.el-menu-item.is-active) {
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        color: #fff;

        .el-icon {
          color: #fff;
        }
      }

      :deep(.el-sub-menu) {
        .el-menu {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          margin-top: 4px;
          padding: 8px;
        }

        .el-menu-item {
          height: 40px;
          line-height: 40px;
          margin-bottom: 4px;

          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .sidebar-footer {
      padding: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .safety-slogan {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;

        .el-icon {
          color: #67c23a;
        }
      }
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
    height: 70px;
    padding: 0 24px;

    .header-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .collapse-btn {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
        color: #6b7280;

        &:hover {
          background: #f3f4f6;
          color: #1a1a2e;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 20px;

      .notice-badge {
        cursor: pointer;

        .notice-icon {
          color: #6b7280;
          transition: all 0.3s;

          &:hover {
            color: #e94560;
          }
        }
      }

      .fullscreen-icon {
        color: #6b7280;
        cursor: pointer;
        transition: all 0.3s;

        &:hover {
          color: #1a1a2e;
        }
      }

      .user-dropdown {
        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          padding: 6px 12px;
          border-radius: 12px;
          transition: all 0.3s;

          &:hover {
            background: #f3f4f6;
          }

          .user-avatar {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }

          .user-detail {
            display: flex;
            flex-direction: column;
            line-height: 1.4;

            .username {
              font-size: 14px;
              font-weight: 600;
              color: #1a1a2e;
            }

            .user-role {
              font-size: 12px;
              color: #6b7280;
            }
          }

          .dropdown-icon {
            color: #9ca3af;
            font-size: 12px;
          }
        }
      }
    }
  }

  .main-content {
    background: #f8fafc;
    padding: 24px;
    overflow-y: auto;
  }
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
