<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

defineOptions({ name: 'ProfileEditView' })

interface ProfileFormState {
  headPic: string
  nickName: string
  email: string
  captcha: string
}

const router = useRouter()
const formRef = ref()
const form = reactive<ProfileFormState>({
  headPic: '',
  nickName: '',
  email: '',
  captcha: '',
})

const rules = {
  email: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    { type: 'email', message: '不是合法的邮箱格式', trigger: ['blur', 'change'] },
  ],
  captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }],
}

const onGetCaptcha = async () => {
  if (!form.email) {
    ElMessage.warning('请先填写邮箱')
    return
  }
  // TODO: 调接口发送验证码
  ElMessage.success('验证码已发送到邮箱（示例）')
}

const onLoadProfile = async () => {
  // TODO: 从接口获取用户信息并填充
  const userInfo = localStorage.getItem('user_info')
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo)
      form.nickName = parsed.nickName || ''
      form.email = parsed.email || ''
      form.headPic = parsed.headPic || ''
    } catch {}
  }
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    // TODO: 提交更新接口
    ElMessage.success('保存成功（示例）')
    router.push('/home')
  })
}

onMounted(onLoadProfile)
</script>

<template>
  <div class="profile-page">
    <el-card class="card" shadow="hover">
      <template #header>
        <div class="card-header">
          <div class="title">个人信息</div>
          <div class="subtitle">编辑您的资料</div>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="头像 URL" prop="headPic">
          <el-input v-model="form.headPic" placeholder="请输入头像 URL" clearable />
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
            <el-button type="primary" @click="onGetCaptcha">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" @click="onSubmit">保存</el-button>
          <el-button @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f5ff 0%, #fafafa 100%);
  padding: 24px;
}
.card {
  width: 560px;
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
  min-width: 120px;
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
</style>
