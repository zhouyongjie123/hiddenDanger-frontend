<template>
  <div class="about-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="page-title">关于系统</h1>
      <p class="page-subtitle">煤矿隐患管理系统 V1.0</p>
    </div>

    <!-- 系统介绍卡片 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="intro-card" shadow="hover">
          <div class="intro-content">
            <div class="intro-icon">
              <el-icon :size="48" color="#fff"><FirstAidKit /></el-icon>
            </div>
            <div class="intro-text">
              <h2>煤矿隐患管理系统</h2>
              <p>本系统是专为煤矿企业设计的安全生产隐患管理解决方案，通过信息化手段实现隐患的全流程管理，
                包括隐患排查、上报、整改、验收等环节，有效提升煤矿安全管理水平，保障职工生命安全。</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 功能模块 -->
    <el-row :gutter="20" class="feature-row">
      <el-col :span="8" v-for="(feature, index) in features" :key="index">
        <el-card class="feature-card" shadow="hover">
          <div class="feature-icon" :style="{ background: feature.gradient }">
            <el-icon :size="32" color="#fff">
              <component :is="feature.icon" />
            </el-icon>
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-desc">{{ feature.desc }}</p>
        </el-card>
      </el-col>
    </el-row>

    <!-- 技术栈 -->
    <el-row :gutter="20" class="tech-row">
      <el-col :span="12">
        <el-card class="tech-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><Cpu /></el-icon>
              <span>技术架构</span>
            </div>
          </template>
          <div class="tech-list">
            <div v-for="(tech, index) in techStack" :key="index" class="tech-item">
              <div class="tech-info">
                <span class="tech-name">{{ tech.name }}</span>
                <span class="tech-version">{{ tech.version }}</span>
              </div>
              <el-tag :type="tech.type" size="small" effect="dark">{{ tech.tag }}</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card class="tech-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <el-icon><InfoFilled /></el-icon>
              <span>系统信息</span>
            </div>
          </template>
          <div class="system-info">
            <div class="info-item">
              <span class="info-label">系统版本</span>
              <span class="info-value">V1.0.0</span>
            </div>
            <div class="info-item">
              <span class="info-label">发布日期</span>
              <span class="info-value">2024年1月</span>
            </div>
            <div class="info-item">
              <span class="info-label">开发团队</span>
              <span class="info-value">煤矿信息化研发中心</span>
            </div>
            <div class="info-item">
              <span class="info-label">技术支持</span>
              <span class="info-value">400-888-8888</span>
            </div>
            <div class="info-item">
              <span class="info-label">版权所有</span>
              <span class="info-value">© 2024 煤矿安全科技有限公司</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 安全提示 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="safety-card" shadow="hover">
          <div class="safety-content">
            <el-icon :size="32" color="#e94560"><WarningFilled /></el-icon>
            <div class="safety-text">
              <h3>安全生产提示</h3>
              <p>煤矿安全生产是企业的生命线，每一位员工都应时刻绷紧安全这根弦。
                发现隐患及时上报，整改措施落实到位，共同营造安全、和谐的工作环境。</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  FirstAidKit,
  Search,
  Warning,
  Tools,
  TrendCharts,
  Document,
  Cpu,
  InfoFilled,
  WarningFilled
} from '@element-plus/icons-vue'

const features = [
  {
    title: '隐患排查',
    desc: '支持定期巡检、专项检查、随机抽查等多种排查方式，确保隐患无遗漏',
    icon: 'Search',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  {
    title: '隐患上报',
    desc: '便捷的隐患上报流程，支持文字描述、图片上传、位置定位等功能',
    icon: 'Warning',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
  },
  {
    title: '整改跟踪',
    desc: '实时跟踪隐患整改进度，自动提醒整改期限，确保整改到位',
    icon: 'Tools',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
  },
  {
    title: '统计分析',
    desc: '多维度数据分析，生成可视化报表，为安全管理决策提供数据支撑',
    icon: 'TrendCharts',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  },
  {
    title: '档案管理',
    desc: '完整的隐患档案管理，支持历史查询、导出打印等功能',
    icon: 'Document',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
  },
  {
    title: '安全预警',
    desc: '智能风险预警机制，及时发现潜在安全隐患，防患于未然',
    icon: 'FirstAidKit',
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
  }
]

const techStack = [
  { name: 'Vue', version: '3.4+', tag: '前端框架', type: 'success' },
  { name: 'TypeScript', version: '5+', tag: '开发语言', type: 'primary' },
  { name: 'Element Plus', version: '2+', tag: 'UI组件库', type: 'warning' },
  { name: 'Pinia', version: '2+', tag: '状态管理', type: 'danger' },
  { name: 'Vue Router', version: '4+', tag: '路由管理', type: 'info' },
  { name: 'Vite', version: '5+', tag: '构建工具', type: 'success' }
]
</script>

<style scoped lang="scss">
.about-container {
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

  .intro-card {
    border-radius: 16px;
    border: none;
    margin-bottom: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);

    :deep(.el-card__body) {
      padding: 40px;
    }

    .intro-content {
      display: flex;
      align-items: center;
      gap: 32px;

      .intro-icon {
        width: 100px;
        height: 100px;
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        border-radius: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
      }

      .intro-text {
        color: #fff;

        h2 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 16px 0;
        }

        p {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
        }
      }
    }
  }

  .feature-row {
    margin-bottom: 20px;

    .feature-card {
      border-radius: 16px;
      border: none;
      text-align: center;
      padding: 30px 20px;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      :deep(.el-card__body) {
        padding: 0;
      }

      .feature-icon {
        width: 70px;
        height: 70px;
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
      }

      .feature-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a2e;
        margin: 0 0 12px 0;
      }

      .feature-desc {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.6;
        margin: 0;
      }
    }
  }

  .tech-row {
    margin-bottom: 20px;

    .tech-card {
      border-radius: 16px;
      border: none;
      height: 100%;

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

      .tech-list {
        .tech-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 0;
          border-bottom: 1px solid #f3f4f6;

          &:last-child {
            border-bottom: none;
          }

          .tech-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .tech-name {
              font-size: 14px;
              font-weight: 500;
              color: #1a1a2e;
            }

            .tech-version {
              font-size: 12px;
              color: #9ca3af;
            }
          }
        }
      }

      .system-info {
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f3f4f6;

          &:last-child {
            border-bottom: none;
          }

          .info-label {
            font-size: 14px;
            color: #6b7280;
          }

          .info-value {
            font-size: 14px;
            font-weight: 500;
            color: #1a1a2e;
          }
        }
      }
    }
  }

  .safety-card {
    border-radius: 16px;
    border: none;
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);

    :deep(.el-card__body) {
      padding: 30px;
    }

    .safety-content {
      display: flex;
      align-items: center;
      gap: 24px;

      .safety-text {
        h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1a1a2e;
          margin: 0 0 8px 0;
        }

        p {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin: 0;
        }
      }
    }
  }
}
</style>
