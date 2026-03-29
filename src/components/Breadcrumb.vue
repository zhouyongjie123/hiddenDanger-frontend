<template>
  <el-breadcrumb separator="/" class="custom-breadcrumb">
    <el-breadcrumb-item :to="{ path: '/home' }">
      <el-icon><HomeFilled /></el-icon>
      <span>首页</span>
    </el-breadcrumb-item>
    <el-breadcrumb-item v-if="currentRoute.meta?.title">
      {{ currentRoute.meta.title }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { HomeFilled } from '@element-plus/icons-vue'

const route = useRoute()
const currentRoute = computed(() => route)
</script>

<style scoped lang="scss">
.custom-breadcrumb {
  :deep(.el-breadcrumb__item) {
    .el-breadcrumb__inner {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #6b7280;
      font-size: 14px;
      transition: all 0.3s;

      &:hover {
        color: #e94560;
      }

      .el-icon {
        font-size: 16px;
      }
    }

    &:last-child {
      .el-breadcrumb__inner {
        color: #1a1a2e;
        font-weight: 600;
      }
    }
  }

  :deep(.el-breadcrumb__separator) {
    color: #d1d5db;
  }
}
</style>
