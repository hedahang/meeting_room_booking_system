<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { login } from '@/api/user'
import { useRouter } from 'vue-router'

defineOptions({ name: 'LoginView' })

const router = useRouter()

interface LoginFormState {
  username: string
  password: string
}

const formRef = ref()
const form = reactive<LoginFormState>({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const data = await login(form)
      ElMessage.success('登录成功')
      console.log(data)
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      localStorage.setItem('user_info', JSON.stringify(data.userInfo))
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } catch (error: any) {
      ElMessage.error(error?.message || '登录失败')
    }
  })
}

const onCreateAccount = () => {
  router.push('/register')
}

const onForgotPassword = () => {
  router.push('/forgot-password')
}
</script>

<template>
  <div class="login-page">
    <el-card class="card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="title">会议室预定系统</div>
          <div class="subtitle">欢迎登录</div>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="onSubmit">登录</el-button>
        </el-form-item>
        <div class="actions">
          <el-button link @click="onCreateAccount">创建账号</el-button>
          <span class="divider">|</span>
          <el-button link @click="onForgotPassword">忘记密码</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f5ff 0%, #fafafa 100%);
  padding: 24px;

  .card {
    width: 430px;
    border-radius: 14px;

    .card-header {
      display: flex;
      flex-direction: column;
      align-items: center;

      .title {
        font-size: 20px;
        font-weight: 700;
      }
      .subtitle {
        margin-top: 4px;
        color: #909399;
        font-size: 13px;
      }
    }

    .submit-btn {
      width: 100%;
    }

    .actions {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: -10px;

      .divider {
        color: #dcdfe6;
      }
    }
  }
}
</style>
