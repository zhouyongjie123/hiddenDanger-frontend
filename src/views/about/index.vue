<template>
  <div class="about-container">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>关于项目</span>
        </div>
      </template>
      <div class="about-content">
        <h2>技术栈</h2>
        <el-descriptions :column="2" border>
          <el-descriptions-item label="Vue">
            <el-tag>Vue 3.4+</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="构建工具">
            <el-tag type="success">Vite 5+</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="语言">
            <el-tag type="info">TypeScript 5+</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="UI 组件库">
            <el-tag type="warning">Element Plus</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态管理">
            <el-tag type="danger">Pinia</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="路由">
            <el-tag>Vue Router 4+</el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <h2 style="margin-top: 30px">项目结构</h2>
        <el-tree :data="treeData" :props="defaultProps" default-expand-all />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const defaultProps = {
  children: 'children',
  label: 'label',
}

const treeData = [
  {
    label: 'src',
    children: [
      {
        label: 'components',
        children: [
          { label: 'Breadcrumb.vue - 面包屑组件' },
        ],
      },
      {
        label: 'layouts',
        children: [
          { label: 'MainLayout.vue - 主布局组件' },
        ],
      },
      {
        label: 'router',
        children: [
          { label: 'index.ts - 路由配置' },
        ],
      },
      {
        label: 'stores',
        children: [
          { label: 'index.ts - 状态管理入口' },
          { label: 'counter.ts - 计数器示例' },
        ],
      },
      {
        label: 'views',
        children: [
          { label: 'login/index.vue - 登录页' },
          { label: 'home/index.vue - 首页' },
          { label: 'about/index.vue - 关于页' },
          { label: 'profile/index.vue - 个人中心' },
          { label: 'error/404.vue - 404页面' },
        ],
      },
      {
        label: 'App.vue - 根组件',
      },
      {
        label: 'main.ts - 入口文件',
      },
    ],
  },
]
</script>

<style scoped lang="scss">
.about-container {
  .card-header {
    font-weight: bold;
  }

  .about-content {
    h2 {
      color: #303133;
      margin-bottom: 20px;
    }
  }
}
</style>
