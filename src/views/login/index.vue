<template>
  <div class="login-container">
    <!-- 背景动画元素 -->
    <div class="bg-animation">
      <div class="coal-particle" v-for="n in 20" :key="n"></div>
    </div>
    
    <div class="login-wrapper">
      <!-- 左侧品牌区域 -->
      <div class="brand-section">
        <div class="brand-content">
          <div class="logo-icon">
            <el-icon :size="80" color="#fff"><FirstAidKit /></el-icon>
          </div>
          <h1 class="brand-title">煤矿隐患管理系统</h1>
          <p class="brand-subtitle">Coal Mine Hidden Danger Management System</p>
          <div class="brand-features">
            <div class="feature-item">
              <el-icon><CircleCheck /></el-icon>
              <span>隐患排查</span>
            </div>
            <div class="feature-item">
              <el-icon><Warning /></el-icon>
              <span>风险预警</span>
            </div>
            <div class="feature-item">
              <el-icon><DataAnalysis /></el-icon>
              <span>数据分析</span>
            </div>
          </div>
        </div>
        <div class="brand-decoration">
          <div class="decoration-circle"></div>
          <div class="decoration-line"></div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-section">
        <el-card class="login-box" shadow="hover">
          <div class="login-header">
            <div class="login-icon">
              <el-icon :size="48" color="#1a5f7a"><UserFilled /></el-icon>
            </div>
            <h2 class="login-title">欢迎登录</h2>
            <p class="login-subtitle">请输入您的账号和密码</p>
          </div>
          
          <!-- 登录方式切换 -->
          <div class="login-tabs">
            <el-tabs v-model="activeTab" class="login-tab">
              <el-tab-pane label="账号密码登录" name="account">
                <el-form
                  ref="accountFormRef"
                  :model="loginForm"
                  :rules="accountLoginRules"
                  class="login-form"
                  @keyup.enter="handleLogin"
                >
                  <el-form-item prop="account">
                    <el-input
                      v-model="loginForm.account"
                      placeholder="请输入账号"
                      :prefix-icon="User"
                      size="large"
                      class="custom-input"
                    />
                  </el-form-item>
                  <el-form-item prop="password">
                    <el-input
                      v-model="loginForm.password"
                      type="password"
                      placeholder="请输入密码"
                      :prefix-icon="Lock"
                      size="large"
                      show-password
                      class="custom-input"
                    />
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="手机号登录" name="phone">
                <el-form
                  ref="phoneFormRef"
                  :model="loginForm"
                  :rules="phoneLoginRules"
                  class="login-form"
                  @keyup.enter="handleLogin"
                >
                  <el-form-item prop="phoneNumber">
                    <el-input
                      v-model="loginForm.phoneNumber"
                      placeholder="请输入手机号"
                      :prefix-icon="Phone"
                      size="large"
                      class="custom-input"
                    />
                  </el-form-item>
                  <el-form-item prop="verificationCode">
                    <el-input
                      v-model="loginForm.verificationCode"
                      placeholder="请输入验证码"
                      :prefix-icon="Key"
                      size="large"
                      class="custom-input"
                    >
                      <template #append>
                        <el-button 
                          :disabled="countdown > 0"
                          @click="getVerificationCode"
                          size="small"
                        >
                          {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
                        </el-button>
                      </template>
                    </el-input>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </div>
          
          <div class="login-options">
            <el-checkbox v-model="rememberMe">记住密码</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码?</el-link>
          </div>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              :loading="loading"
              class="login-btn"
              @click="handleLogin"
            >
              <el-icon class="btn-icon" v-if="!loading"><ArrowRight /></el-icon>
              <span>{{ loading ? '登录中...' : '立即登录' }}</span>
            </el-button>
          </el-form-item>
          
          <div class="login-footer">
            <el-divider>
              <span class="divider-text">安全提示</span>
            </el-divider>
            <p class="safety-tips">
              <el-icon><WarningFilled /></el-icon>
              请妥善保管您的账号密码，定期更换密码以确保安全
            </p>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 底部版权 -->
    <div class="login-copyright">
      <p>© 2024 煤矿隐患管理系统 | 安全生产 人人有责</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { 
  User, 
  Lock, 
  UserFilled, 
  ArrowRight, 
  FirstAidKit, 
  CircleCheck, 
  Warning, 
  DataAnalysis,
  WarningFilled,
  Phone,
  Key
} from '@element-plus/icons-vue'
import { authApi } from '@/api/auth'
import { useUserStore } from '@/stores'
import type { LoginRequest } from '@/types/api'

const router = useRouter()
const userStore = useUserStore()
const accountFormRef = ref<FormInstance>()
const phoneFormRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)
const activeTab = ref('account')
const countdown = ref(0)

const loginForm = reactive<LoginRequest>({
  account: 'admin',
  password: '123',
  phoneNumber: '',
  verificationCode: '',
})

const accountLoginRules: FormRules = {
  account: [
    { required: true, message: '请输入账号', trigger: 'blur' },
    { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
}

const phoneLoginRules: FormRules = {
  phoneNumber: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 6, max: 6, message: '验证码长度为 6 位', trigger: 'blur' },
  ],
}

const handleLogin = async () => {
  let formRef
  if (activeTab.value === 'account') {
    formRef = accountFormRef.value
  } else {
    formRef = phoneFormRef.value
  }
  
  if (!formRef) return

  try {
    const valid = await formRef.validate()
    if (valid) {
      loading.value = true
      
      // 根据当前登录方式构建请求数据
      let loginData = {}
      if (activeTab.value === 'account') {
        // 账号密码登录
        loginData = {
          account: loginForm.account,
          password: loginForm.password
        }
      } else {
        // 手机号验证码登录
        loginData = {
          phoneNumber: loginForm.phoneNumber,
          verificationCode: loginForm.verificationCode
        }
      }
      
      console.log('登录请求数据:', loginData)
      
      // 调用后端登录接口
      const response = await authApi.login(loginData)
      console.log('登录成功，响应:', response)
      const userInfo = response.data
      
      loading.value = false
      
      // 存储用户信息
      userStore.setUserInfo(userInfo)
      
      ElMessage.success('登录成功，欢迎回来！')
      router.push('/')
    }
  } catch (error) {
    loading.value = false
    console.error('登录失败:', error)
    ElMessage.error('登录失败，请检查网络连接或后端服务是否运行')
  }
}

const getVerificationCode = () => {
  if (!loginForm.phoneNumber) {
    ElMessage.warning('请输入手机号')
    return
  }
  
  if (!/^1[3-9]\d{9}$/.test(loginForm.phoneNumber)) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  
  // 模拟发送验证码
  ElMessage.success('验证码已发送')
  
  // 倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

// 背景动画
.bg-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  .coal-particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    animation: float 15s infinite;

    @for $i from 1 through 20 {
      &:nth-child(#{$i}) {
        left: random(100) * 1%;
        animation-delay: random(15) * -1s;
        animation-duration: (random(10) + 10) * 1s;
        opacity: random(5) * 0.1;
      }
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(720deg);
    opacity: 0;
  }
}

.login-wrapper {
  flex: 1;
  display: flex;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 40px 60px;
  align-items: center;
  gap: 80px;
}

// 左侧品牌区域
.brand-section {
  flex: 1;
  color: #fff;
  position: relative;
  z-index: 1;

  .brand-content {
    .logo-icon {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 40px;
      box-shadow: 0 20px 40px rgba(233, 69, 96, 0.3);
      animation: pulse 2s ease-in-out infinite;
    }

    .brand-title {
      font-size: 48px;
      font-weight: 700;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #fff 0%, #a0d2eb 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .brand-subtitle {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 50px;
      letter-spacing: 2px;
    }

    .brand-features {
      display: flex;
      gap: 40px;

      .feature-item {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.8);
        transition: all 0.3s;

        .el-icon {
          font-size: 24px;
          color: #e94560;
        }

        &:hover {
          color: #fff;
          transform: translateX(5px);
        }
      }
    }
  }

  .brand-decoration {
    position: absolute;
    top: 50%;
    right: -40px;
    transform: translateY(-50%);

    .decoration-circle {
      width: 300px;
      height: 300px;
      border: 2px solid rgba(233, 69, 96, 0.2);
      border-radius: 50%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation: rotate 20s linear infinite;
    }

    .decoration-line {
      width: 2px;
      height: 200px;
      background: linear-gradient(180deg, transparent 0%, rgba(233, 69, 96, 0.5) 50%, transparent 100%);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 20px 40px rgba(233, 69, 96, 0.3);
  }
  50% {
    box-shadow: 0 20px 60px rgba(233, 69, 96, 0.5);
  }
}

@keyframes rotate {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

// 右侧登录区域
.login-section {
  width: 480px;
  position: relative;
  z-index: 1;

  .login-box {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 24px;
    border: none;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

    :deep(.el-card__body) {
      padding: 50px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 30px;

      .login-icon {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, rgba(26, 95, 122, 0.1) 0%, rgba(26, 95, 122, 0.05) 100%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 24px;
      }

      .login-title {
        font-size: 32px;
        font-weight: 700;
        color: #1a1a2e;
        margin-bottom: 12px;
      }

      .login-subtitle {
        font-size: 14px;
        color: #6b7280;
      }
    }

    // 登录方式切换
    .login-tabs {
      margin-bottom: 20px;

      .login-tab {
        :deep(.el-tabs__header) {
          margin-bottom: 24px;

          .el-tabs__tab {
            font-size: 15px;
            font-weight: 500;
            color: #6b7280;

            &.is-active {
              color: #1a5f7a;
              font-weight: 600;
            }
          }

          .el-tabs__active-bar {
            background: #1a5f7a;
            height: 3px;
          }
        }
      }
    }

    .login-form {
      .custom-input {
        :deep(.el-input__wrapper) {
          background: #f3f4f6;
          border-radius: 12px;
          box-shadow: none;
          padding: 4px 16px;
          height: 52px;

          &.is-focus {
            background: #fff;
            box-shadow: 0 0 0 2px rgba(26, 95, 122, 0.2);
          }
        }

        :deep(.el-input__inner) {
          font-size: 15px;
        }
      }
    }

    .login-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 8px 0 24px;

      :deep(.el-checkbox__label) {
        color: #6b7280;
      }
    }

    .login-btn {
      width: 100%;
      height: 52px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(135deg, #1a5f7a 0%, #159895 100%);
      border: none;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(26, 95, 122, 0.3);
      }

      .btn-icon {
        margin-right: 8px;
      }
    }

    .login-footer {
      margin-top: 30px;

      .divider-text {
        color: #9ca3af;
        font-size: 12px;
      }

      .safety-tips {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 12px;
        color: #6b7280;
        margin-top: 16px;

        .el-icon {
          color: #f59e0b;
          font-size: 14px;
        }
      }
    }
  }
}

// 底部版权
.login-copyright {
  text-align: center;
  padding: 20px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
  position: relative;
  z-index: 1;
}

// 响应式
@media (max-width: 1200px) {
  .login-wrapper {
    flex-direction: column;
    gap: 40px;
    padding: 40px 20px;
  }

  .brand-section {
    text-align: center;

    .brand-content {
      .logo-icon {
        margin: 0 auto 30px;
      }

      .brand-features {
        justify-content: center;
      }
    }

    .brand-decoration {
      display: none;
    }
  }

  .login-section {
    width: 100%;
    max-width: 480px;
  }
}
</style>
