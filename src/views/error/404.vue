<template>
  <div class="error-container">
    <div class="error-content">
      <h1>404</h1>
      <p>抱歉，您访问的页面不存在</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped lang="scss">
.error-container {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .error-content {
    text-align: center;

    h1 {
      font-size: 120px;
      color: #409EFF;
      margin: 0;
      line-height: 1;
    }

    p {
      font-size: 20px;
      color: #606266;
      margin: 20px 0 30px;
    }
  }
}
</style>
