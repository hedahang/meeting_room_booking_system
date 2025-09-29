<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

interface RegisterFormState {
  username: string
  password: string
  nickName: string
  email: string
  captcha: string
}

const formRef = ref()
const form = reactive<RegisterFormState>({
  username: '',
  password: '',
  nickName: '',
  email: '',
  captcha: '',
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: ['blur', 'change'] },
  ],
  captcha: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
  ],
}

const getCaptcha = async () => {
  if (!form.email) {
    ElMessage.warning('请先填写邮箱')
    return
  }
  try {
    await axios.get('/user/register-captcha', { params: { email: form.email } })
    ElMessage.success('验证码已发送到邮箱')
  } catch (error: any) {
    ElMessage.error(error?.response?.data?.message || '验证码发送失败')
  }
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      const { data } = await axios.post('/user/register', form)
      ElMessage.success(data || '注册成功')
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '注册失败')
    }
  })
}
</script>

<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">注册</div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="form.nickName" placeholder="请输入昵称" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="captcha">
        <el-input v-model="form.captcha" placeholder="请输入验证码" />
        <el-button style="margin-left: 8px" @click="getCaptcha">获取验证码</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  
</template>

<style scoped>
.card {
  max-width: 520px;
  margin: 40px auto;
}
.card-header {
  font-weight: 600;
}
</style>



