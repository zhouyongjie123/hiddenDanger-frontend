<template>
  <div class="home-container">
    <el-row :gutter="20">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="stat-card" :body-style="{ padding: '20px' }">
          <div class="stat-item">
            <div class="stat-icon" :style="{ backgroundColor: item.color }">
              <el-icon :size="32" color="#fff">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-label">{{ item.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>欢迎使用</span>
            </div>
          </template>
          <div class="welcome-content">
            <h3>Vue3 + Element Plus + Pinia + Vue Router 项目框架</h3>
            <p>这是一个基于 Vue3 生态系统的现代化前端项目模板，包含以下特性：</p>
            <ul>
              <li>Vue 3 - 渐进式 JavaScript 框架</li>
              <li>TypeScript - 类型安全的 JavaScript 超集</li>
              <li>Element Plus - 基于 Vue 3 的组件库</li>
              <li>Pinia - Vue 官方推荐的状态管理方案</li>
              <li>Vue Router - Vue.js 的官方路由管理器</li>
              <li>Vite - 下一代前端构建工具</li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>快速开始</span>
            </div>
          </template>
          <div class="quick-start">
            <el-steps direction="vertical" :active="1">
              <el-step title="安装依赖" description="npm install" />
              <el-step title="启动开发服务器" description="npm run dev" />
              <el-step title="开始开发" description="编辑 src 目录下的文件" />
              <el-step title="构建生产环境" description="npm run build" />
            </el-steps>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="24">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>Pinia 状态管理示例</span>
            </div>
          </template>
          <div class="pinia-demo">
            <p>当前计数: <strong>{{ counterStore.count }}</strong></p>
            <p>双倍计数: <strong>{{ counterStore.doubleCount }}</strong></p>
            <el-button type="primary" @click="counterStore.increment">
              增加计数
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCounterStore } from '@/stores'

const counterStore = useCounterStore()

const statistics = ref([
  { label: '用户数', value: '1,234', icon: 'UserFilled', color: '#409EFF' },
  { label: '订单数', value: '5,678', icon: 'ShoppingCartFull', color: '#67C23A' },
  { label: '收入', value: '¥98,765', icon: 'Money', color: '#E6A23C' },
  { label: '消息', value: '99+', icon: 'ChatDotRound', color: '#F56C6C' },
])
</script>

<style scoped lang="scss">
.home-container {
  .stat-card {
    .stat-item {
      display: flex;
      align-items: center;

      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
      }

      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #303133;
        }

        .stat-label {
          font-size: 14px;
          color: #909399;
          margin-top: 4px;
        }
      }
    }
  }

  .card-header {
    font-weight: bold;
  }

  .welcome-content {
    h3 {
      margin-top: 0;
      color: #303133;
    }

    ul {
      padding-left: 20px;

      li {
        margin: 8px 0;
        color: #606266;
      }
    }
  }

  .quick-start {
    padding: 10px 0;
  }

  .pinia-demo {
    p {
      margin: 10px 0;
      font-size: 16px;
    }
  }
}
</style>
