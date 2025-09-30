<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { requestRegisterCaptcha, register } from '@/api/user'
import { useRouter } from 'vue-router'

defineOptions({ name: 'RegisterView' })

interface RegisterFormState {
  username: string
  password: string
  confirmPassword: string
  nickName: string
  email: string
  captcha: string
}

const formRef = ref()
const form = reactive<RegisterFormState>({
  username: '',
  password: '',
  confirmPassword: '',
  nickName: '',
  email: '',
  captcha: '',
})

const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (!value) {
    callback(new Error('请确认密码'))
    return
  }
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }
  callback()
}

const rules = {
  username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' },
  ],
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
}

const router = useRouter()
const onGoLogin = () => {
  router.push('/login')
}

const getCaptcha = async () => {
  console.log(form)
  if (!form.email) {
    ElMessage.warning('请先填写邮箱')
    return
  }
  try {
    await requestRegisterCaptcha(form.email)
    ElMessage.success('验证码已发送到邮箱')
  } catch (error: any) {
    ElMessage.error(error?.message || '验证码发送失败')
  }
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const data = await register(form)
      ElMessage.success((data as any) || '注册成功')
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      ElMessage.error(error?.message || '注册失败')
    }
  })
}
</script>

<template>
  <div class="register-page">
    <el-card class="card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="title">会议室预定系统</div>
          <div class="subtitle">创建账号</div>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
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
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="form.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入密码"
          />
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-row">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <el-button type="primary" @click="getCaptcha">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="onSubmit">注册</el-button>
        </el-form-item>
        <div class="actions">
          <span>已有账号？</span>
          <el-button link @click="onGoLogin">去登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f5ff 0%, #fafafa 100%);
  padding: 24px;

  .card {
    width: 520px;
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
      gap: 6px;
      margin-top: -10px;
    }

    .captcha-row {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;

      :deep(.el-input) {
        flex: 1;
      }
    }
  }
}
</style>
