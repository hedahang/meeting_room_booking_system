<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

defineOptions({ name: 'ForgotPasswordView' })

const router = useRouter()

interface FormState {
  email: string
  captcha: string
  newPassword: string
  confirmPassword: string
}

const formRef = ref()
const form = reactive<FormState>({
  email: '',
  captcha: '',
  newPassword: '',
  confirmPassword: '',
})

const rules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, val: string, cb: any) => {
        if (!val) return cb(new Error('请确认密码'))
        if (val !== form.newPassword) return cb(new Error('两次输入的密码不一致'))
        cb()
      },
      trigger: 'blur',
    },
  ],
}

const onGetCaptcha = async () => {
  if (!form.email) {
    ElMessage.warning('请先填写邮箱')
    return
  }
  ElMessage.success('验证码已发送到邮箱（示例）')
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    // TODO: 调用后端重置密码接口
    ElMessage.success('密码重置成功')
    router.push('/login')
  })
}
</script>

<template>
  <div class="forgot-page">
    <el-card class="card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="title">会议室预定系统</div>
          <div class="subtitle">找回密码</div>
        </div>
      </template>
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="验证码" prop="captcha">
          <div class="captcha-row">
            <el-input v-model="form.captcha" placeholder="请输入验证码" />
            <el-button type="primary" @click="onGetCaptcha">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="form.newPassword"
            type="password"
            show-password
            placeholder="请输入新密码"
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
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="onSubmit">重置密码</el-button>
        </el-form-item>
        <div class="actions">
          <el-button link @click="() => router.push('/login')">返回登录</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.forgot-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f5ff 0%, #fafafa 100%);
  padding: 24px;
}
.card {
  width: 520px;
  border-radius: 14px;
}
.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 20px;
  font-weight: 700;
}
.subtitle {
  margin-top: 4px;
  color: #909399;
  font-size: 13px;
}
.submit-btn {
  width: 100%;
}
.captcha-row {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
.captcha-row :deep(.el-input) {
  flex: 1;
}
.actions {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
