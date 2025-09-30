<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserInfo, requestUpdateUserCaptcha, updateUserInfo } from '@/api/user'
import { computed } from 'vue'

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

// 交互状态
const sendingCaptcha = ref(false)
const captchaCountdown = ref(0)
const submitting = ref(false)

function startCaptchaCountdown(seconds = 60) {
  captchaCountdown.value = seconds
  const timer = setInterval(() => {
    if (captchaCountdown.value <= 1) {
      captchaCountdown.value = 0
      clearInterval(timer)
      return
    }
    captchaCountdown.value -= 1
  }, 1000)
}

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
  if (sendingCaptcha.value || captchaCountdown.value > 0) return
  try {
    sendingCaptcha.value = true
    await requestUpdateUserCaptcha(form.email)
    ElMessage.success('验证码已发送到邮箱')
    startCaptchaCountdown(60)
  } catch (error: any) {
    ElMessage.error(error?.message || '验证码发送失败')
  } finally {
    sendingCaptcha.value = false
  }
}

const onLoadProfile = async () => {
  try {
    const data = await getUserInfo()
    form.nickName = data.nickName || ''
    form.email = data.email || ''
    form.headPic = data.headPic || ''
  } catch (error: any) {
    ElMessage.error(error?.message || '获取用户信息失败')
  }
}

// 上传头像配置
const uploadAction = '/user/upload'
const uploadHeaders = computed(() => {
  const token = localStorage.getItem('token') || ''
  return token ? { Authorization: `Bearer ${token}` } : {}
})

function resolveUploadUrl(response: any): string {
  // 兼容统一响应或直接返回
  if (response && typeof response === 'object') {
    if ('data' in response && response.data) return response.data as string
    if ('url' in response) return response.url as string
  }
  if (typeof response === 'string') return response
  return ''
}

const onUploadSuccess = (response: any) => {
  const url = resolveUploadUrl(response)
  if (!url) {
    ElMessage.error('上传成功但未返回图片地址')
    return
  }
  form.headPic = url
  ElMessage.success('头像已上传')
}

const onUploadError = () => {
  ElMessage.error('头像上传失败')
}

const beforeUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) ElMessage.error('仅支持图片文件')
  if (!isLt2M) ElMessage.error('图片大小不能超过 2MB')
  return isImage && isLt2M
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      submitting.value = true
      await updateUserInfo({
        headPic: form.headPic,
        nickName: form.nickName,
        email: form.email,
        captcha: form.captcha,
      })
      ElMessage.success('保存成功')
      router.push('/home')
    } catch (error: any) {
      ElMessage.error(error?.message || '保存失败')
    } finally {
      submitting.value = false
    }
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
        <el-form-item label="头像" prop="headPic">
          <el-upload
            :action="uploadAction"
            :headers="uploadHeaders"
            :show-file-list="false"
            :before-upload="beforeUpload"
            :on-success="onUploadSuccess"
            :on-error="onUploadError"
          >
            <div class="avatar-uploader">
              <img v-if="form.headPic" :src="form.headPic" alt="avatar" class="avatar" />
              <div v-else class="avatar-placeholder">上传头像</div>
            </div>
          </el-upload>
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
            <el-button
              type="primary"
              :loading="sendingCaptcha"
              :disabled="captchaCountdown > 0"
              @click="onGetCaptcha"
            >
              {{ captchaCountdown > 0 ? `${captchaCountdown}s 后重发` : '获取验证码' }}
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit-btn" :loading="submitting" @click="onSubmit"
            >保存</el-button
          >
          <el-button :disabled="submitting" @click="router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.profile-page {
  /* 适配 layout 内容区：去除全屏与渐变背景，仅保留内边距 */
  // padding: 16px;

  .card {
    margin: 0 auto;
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
      min-width: 120px;
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
  .avatar-uploader {
    width: 88px;
    height: 88px;
    border: 1px dashed #dcdfe6;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    cursor: pointer;
    background: #fafafa;

    .avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .avatar-placeholder {
      color: #909399;
      font-size: 12px;
    }
  }
}
</style>
