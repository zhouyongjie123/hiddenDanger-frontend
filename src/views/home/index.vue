<template>
  <div class="home-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">隐患管理控制台</h1>
        <p class="page-subtitle">实时监控煤矿安全隐患，保障生产安全</p>
      </div>
      <div class="header-right">
        <el-button type="primary" size="large" class="report-btn">
          <el-icon><Plus /></el-icon>
          上报隐患
        </el-button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :span="6" v-for="(item, index) in statistics" :key="index">
        <el-card class="stat-card" :class="item.type" shadow="hover">
          <div class="stat-content">
            <div class="stat-icon-wrapper" :style="{ background: item.gradient }">
              <el-icon :size="28" color="#fff">
                <component :is="item.icon" />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-label">{{ item.label }}</div>
              <div class="stat-value">{{ item.value }}</div>
              <div class="stat-trend" :class="item.trendType">
                <el-icon v-if="item.trendIcon"><component :is="item.trendIcon" /></el-icon>
                <span>{{ item.trend }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 中间区域 -->
    <el-row :gutter="20" class="middle-row">
      <!-- 隐患趋势图 -->
      <el-col :span="16">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><TrendCharts /></el-icon>
                <span>隐患趋势分析</span>
              </div>
              <el-radio-group v-model="timeRange" size="small">
                <el-radio-button label="week">本周</el-radio-button>
                <el-radio-button label="month">本月</el-radio-button>
                <el-radio-button label="year">本年</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="mock-chart">
              <div class="chart-bars">
                <div 
                  v-for="(bar, idx) in chartData" 
                  :key="idx"
                  class="bar-item"
                  :style="{ height: bar.height + '%', background: bar.color }"
                >
                  <span class="bar-value">{{ bar.value }}</span>
                </div>
              </div>
              <div class="chart-labels">
                <span v-for="(bar, idx) in chartData" :key="idx">{{ bar.label }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 隐患等级分布 -->
      <el-col :span="8">
        <el-card class="chart-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><PieChart /></el-icon>
                <span>隐患等级分布</span>
              </div>
            </div>
          </template>
          <div class="danger-levels">
            <div 
              v-for="(level, idx) in dangerLevels" 
              :key="idx"
              class="level-item"
            >
              <div class="level-info">
                <span class="level-dot" :style="{ background: level.color }"></span>
                <span class="level-name">{{ level.name }}</span>
              </div>
              <div class="level-progress">
                <el-progress 
                  :percentage="level.percentage" 
                  :color="level.color"
                  :stroke-width="8"
                  :show-text="false"
                />
              </div>
              <div class="level-count">{{ level.count }}个</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 底部区域 -->
    <el-row :gutter="20" class="bottom-row">
      <!-- 最新隐患 -->
      <el-col :span="12">
        <el-card class="list-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><Warning /></el-icon>
                <span>最新隐患</span>
              </div>
              <el-link type="primary" :underline="false">查看全部</el-link>
            </div>
          </template>
          <div class="danger-list">
            <div 
              v-for="(item, idx) in latestDangers" 
              :key="idx"
              class="danger-item"
            >
              <div class="danger-status" :class="item.status">
                <el-icon v-if="item.status === 'pending'"><Clock /></el-icon>
                <el-icon v-else-if="item.status === 'processing'"><Loading /></el-icon>
                <el-icon v-else><CircleCheck /></el-icon>
              </div>
              <div class="danger-content">
                <div class="danger-title">{{ item.title }}</div>
                <div class="danger-meta">
                  <span class="location">
                    <el-icon><Location /></el-icon>
                    {{ item.location }}
                  </span>
                  <span class="time">{{ item.time }}</span>
                </div>
              </div>
              <el-tag :type="item.levelType" size="small" effect="dark">
                {{ item.level }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 待办事项 -->
      <el-col :span="12">
        <el-card class="list-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <div class="header-title">
                <el-icon><Bell /></el-icon>
                <span>待办事项</span>
              </div>
              <el-badge :value="todoList.length" type="danger" />
            </div>
          </template>
          <div class="todo-list">
            <div 
              v-for="(item, idx) in todoList" 
              :key="idx"
              class="todo-item"
              :class="{ urgent: item.urgent }"
            >
              <el-checkbox v-model="item.done">
                <span class="todo-text" :class="{ done: item.done }">{{ item.text }}</span>
              </el-checkbox>
              <el-tag :type="item.urgent ? 'danger' : 'warning'" size="small">
                {{ item.urgent ? '紧急' : '普通' }}
              </el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷入口 -->
    <el-row :gutter="20" class="quick-row">
      <el-col :span="24">
        <el-card class="quick-card" shadow="hover">
          <div class="quick-links">
            <div 
              v-for="(link, idx) in quickLinks" 
              :key="idx"
              class="quick-item"
              @click="handleQuickLink(link)"
            >
              <div class="quick-icon" :style="{ background: link.bgColor }">
                <el-icon :size="24" color="#fff">
                  <component :is="link.icon" />
                </el-icon>
              </div>
              <span class="quick-name">{{ link.name }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus,
  Warning,
  WarningFilled,
  CircleCheck,
  Clock,
  TrendCharts,
  PieChart,
  Location,
  Bell,
  Loading,
  Document,
  Search,
  DataAnalysis,
  FirstAidKit,
  Tools,
  Setting,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'

const timeRange = ref('week')

// 统计数据
const statistics = ref([
  { 
    label: '隐患总数', 
    value: '128', 
    icon: 'WarningFilled', 
    type: 'primary',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    trend: '较上月 +12%',
    trendType: 'up',
    trendIcon: 'ArrowUp'
  },
  { 
    label: '待处理', 
    value: '23', 
    icon: 'Clock', 
    type: 'warning',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    trend: '较上月 -5%',
    trendType: 'down',
    trendIcon: 'ArrowDown'
  },
  { 
    label: '已整改', 
    value: '98', 
    icon: 'CircleCheck', 
    type: 'success',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    trend: '较上月 +18%',
    trendType: 'up',
    trendIcon: 'ArrowUp'
  },
  { 
    label: '整改率', 
    value: '76.5%', 
    icon: 'DataAnalysis', 
    type: 'info',
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    trend: '较上月 +3.2%',
    trendType: 'up',
    trendIcon: 'ArrowUp'
  },
])

// 图表数据
const chartData = ref([
  { label: '周一', value: 12, height: 40, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周二', value: 19, height: 60, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周三', value: 8, height: 25, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周四', value: 15, height: 50, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周五', value: 22, height: 75, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周六', value: 6, height: 20, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
  { label: '周日', value: 10, height: 35, color: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)' },
])

// 隐患等级分布
const dangerLevels = ref([
  { name: '重大隐患', count: 5, percentage: 8, color: '#f56c6c' },
  { name: '较大隐患', count: 18, percentage: 28, color: '#e6a23c' },
  { name: '一般隐患', count: 45, percentage: 42, color: '#409eff' },
  { name: '轻微隐患', count: 28, percentage: 22, color: '#67c23a' },
])

// 最新隐患
const latestDangers = ref([
  { title: '主通风机房设备老化', location: '一号矿井', time: '2小时前', status: 'pending', level: '重大', levelType: 'danger' },
  { title: '采煤工作面支护不牢', location: '二号矿井', time: '4小时前', status: 'processing', level: '较大', levelType: 'warning' },
  { title: '瓦斯检测仪故障', location: '三号矿井', time: '6小时前', status: 'completed', level: '一般', levelType: 'info' },
  { title: '排水系统管道漏水', location: '四号矿井', time: '8小时前', status: 'pending', level: '一般', levelType: 'info' },
  { title: '电缆绝缘层破损', location: '五号矿井', time: '1天前', status: 'completed', level: '轻微', levelType: 'success' },
])

// 待办事项
const todoList = ref([
  { text: '完成月度安全隐患排查报告', done: false, urgent: true },
  { text: '审核三号矿井整改方案', done: false, urgent: true },
  { text: '更新安全培训资料', done: false, urgent: false },
  { text: '检查消防设备有效期', done: true, urgent: false },
  { text: '组织应急演练', done: false, urgent: false },
])

// 快捷入口
const quickLinks = ref([
  { name: '隐患上报', icon: 'Plus', bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { name: '隐患查询', icon: 'Search', bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { name: '整改跟踪', icon: 'Tools', bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { name: '统计分析', icon: 'DataAnalysis', bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { name: '安全档案', icon: 'Document', bgColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { name: '系统设置', icon: 'Setting', bgColor: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)' },
])

const handleQuickLink = (link: any) => {
  console.log('点击了:', link.name)
}
</script>

<style scoped lang="scss">
.home-container {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    .header-left {
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

    .header-right {
      .report-btn {
        background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
        border: none;
        padding: 12px 24px;
        font-size: 15px;
        font-weight: 600;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(233, 69, 96, 0.3);
        }

        .el-icon {
          margin-right: 8px;
        }
      }
    }
  }

  // 统计卡片
  .stat-row {
    margin-bottom: 20px;

    .stat-card {
      border-radius: 16px;
      border: none;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
      }

      :deep(.el-card__body) {
        padding: 24px;
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;

          .stat-label {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
          }

          .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #1a1a2e;
            margin-bottom: 4px;
          }

          .stat-trend {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 12px;

            &.up {
              color: #67c23a;
            }

            &.down {
              color: #f56c6c;
            }

            .el-icon {
              font-size: 12px;
            }
          }
        }
      }
    }
  }

  // 中间区域
  .middle-row {
    margin-bottom: 20px;

    .chart-card {
      border-radius: 16px;
      border: none;
      height: 380px;

      :deep(.el-card__header) {
        padding: 20px 24px;
        border-bottom: 1px solid #f3f4f6;
      }

      :deep(.el-card__body) {
        padding: 24px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-title {
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
      }

      .chart-placeholder {
        height: 280px;
        display: flex;
        align-items: center;
        justify-content: center;

        .mock-chart {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;

          .chart-bars {
            flex: 1;
            display: flex;
            align-items: flex-end;
            justify-content: space-around;
            padding: 20px 0;
            gap: 16px;

            .bar-item {
              flex: 1;
              max-width: 60px;
              border-radius: 8px 8px 0 0;
              position: relative;
              transition: all 0.3s;
              cursor: pointer;

              &:hover {
                opacity: 0.8;
              }

              .bar-value {
                position: absolute;
                top: -24px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                font-weight: 600;
                color: #667eea;
              }
            }
          }

          .chart-labels {
            display: flex;
            justify-content: space-around;
            padding-top: 12px;
            border-top: 1px solid #f3f4f6;

            span {
              flex: 1;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
            }
          }
        }
      }

      .danger-levels {
        padding: 10px 0;

        .level-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;

          &:last-child {
            margin-bottom: 0;
          }

          .level-info {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 90px;
            flex-shrink: 0;

            .level-dot {
              width: 10px;
              height: 10px;
              border-radius: 50%;
            }

            .level-name {
              font-size: 13px;
              color: #4b5563;
            }
          }

          .level-progress {
            flex: 1;
          }

          .level-count {
            width: 50px;
            text-align: right;
            font-size: 13px;
            font-weight: 600;
            color: #1a1a2e;
          }
        }
      }
    }
  }

  // 底部区域
  .bottom-row {
    margin-bottom: 20px;

    .list-card {
      border-radius: 16px;
      border: none;
      height: 360px;

      :deep(.el-card__header) {
        padding: 20px 24px;
        border-bottom: 1px solid #f3f4f6;
      }

      :deep(.el-card__body) {
        padding: 16px 24px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .header-title {
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
      }

      .danger-list {
        .danger-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid #f3f4f6;

          &:last-child {
            border-bottom: none;
          }

          .danger-status {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;

            &.pending {
              background: #fef3c7;
              color: #f59e0b;
            }

            &.processing {
              background: #dbeafe;
              color: #3b82f6;
            }

            &.completed {
              background: #d1fae5;
              color: #10b981;
            }
          }

          .danger-content {
            flex: 1;
            min-width: 0;

            .danger-title {
              font-size: 14px;
              font-weight: 500;
              color: #1a1a2e;
              margin-bottom: 6px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }

            .danger-meta {
              display: flex;
              align-items: center;
              gap: 16px;
              font-size: 12px;
              color: #6b7280;

              .location {
                display: flex;
                align-items: center;
                gap: 4px;

                .el-icon {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }

      .todo-list {
        .todo-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #f3f4f6;
          transition: all 0.3s;

          &:last-child {
            border-bottom: none;
          }

          &.urgent {
            background: linear-gradient(90deg, rgba(245, 108, 108, 0.05) 0%, transparent 100%);
            margin: 0 -24px;
            padding: 14px 24px;
          }

          :deep(.el-checkbox) {
            .el-checkbox__label {
              font-size: 14px;
              color: #4b5563;
            }
          }

          .todo-text {
            &.done {
              text-decoration: line-through;
              color: #9ca3af;
            }
          }
        }
      }
    }
  }

  // 快捷入口
  .quick-row {
    .quick-card {
      border-radius: 16px;
      border: none;

      :deep(.el-card__body) {
        padding: 24px;
      }

      .quick-links {
        display: flex;
        justify-content: space-around;
        gap: 20px;

        .quick-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.3s;
          padding: 16px 32px;
          border-radius: 16px;

          &:hover {
            background: #f9fafb;
            transform: translateY(-4px);
          }

          .quick-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s;
          }

          .quick-name {
            font-size: 14px;
            color: #4b5563;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style>
