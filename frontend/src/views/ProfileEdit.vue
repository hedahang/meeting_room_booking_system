<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { getUserInfo, updateUserInfo, updatePassword } from '@/api/user'
import { computed } from 'vue'

defineOptions({ name: 'ProfileEditView' })

interface ProfileFormState {
  headPic: string
  nickName: string
  phoneNumber: string
}
interface PasswordFormState {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const router = useRouter()
const formRef = ref()
const passwordFormRef = ref()
const form = reactive<ProfileFormState>({
  headPic: '',
  nickName: '',
  phoneNumber: '',
})
const passwordForm = reactive<PasswordFormState>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const submitting = ref(false)
const submittingPwd = ref(false)
const activeTab = ref('info')

const rules = {
  nickName: [{ required: true, message: '昵称不能为空', trigger: 'blur' }],
}
const passwordRules = {
  oldPassword: [
    { required: true, message: '旧密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
  newPassword: [
    { required: true, message: '新密码不能为空', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (_: any, val: string, cb: any) => {
        if (!val) return cb(new Error('请确认密码'))
        if (val !== passwordForm.newPassword) return cb(new Error('两次输入的密码不一致'))
        cb()
      },
      trigger: 'blur',
    },
  ],
}

const onLoadProfile = async () => {
  try {
    const data = await getUserInfo()
    form.nickName = data.nickName || ''
    form.headPic = data.headPic || ''
    form.phoneNumber = (data as any).phoneNumber || ''
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
        phoneNumber: form.phoneNumber,
      })
      ElMessage.success('保存成功')
    } catch (error: any) {
      ElMessage.error(error?.message || '保存失败')
    } finally {
      submitting.value = false
    }
  })
}

const onSubmitPassword = async () => {
  await passwordFormRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      submittingPwd.value = true
      await updatePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      ElMessage.success('密码修改成功')
      // 可根据需要清空密码表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''
    } catch (error: any) {
      ElMessage.error(error?.message || '密码修改失败')
    } finally {
      submittingPwd.value = false
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
          <div class="title">个人中心</div>
          <div class="subtitle">编辑资料与修改密码</div>
        </div>
      </template>

      <el-tabs v-model="activeTab">
        <el-tab-pane label="资料信息" name="info">
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
            <el-form-item label="手机号" prop="phoneNumber">
              <el-input v-model="form.phoneNumber" placeholder="请输入手机号" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" class="submit-btn" :loading="submitting" @click="onSubmit"
                >保存</el-button
              >
              <el-button :disabled="submitting" @click="router.back()">取消</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane label="修改密码" name="password">
          <el-form
            ref="passwordFormRef"
            :model="passwordForm"
            :rules="passwordRules"
            label-width="90px"
          >
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input
                v-model="passwordForm.oldPassword"
                type="password"
                show-password
                placeholder="请输入旧密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword">
              <el-input
                v-model="passwordForm.newPassword"
                type="password"
                show-password
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input
                v-model="passwordForm.confirmPassword"
                type="password"
                show-password
                placeholder="请再次输入密码"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" :loading="submittingPwd" @click="onSubmitPassword"
                >修改密码</el-button
              >
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
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
