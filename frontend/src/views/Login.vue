<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import { useRouter } from 'vue-router'

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
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码不能少于 6 位', trigger: 'blur' },
  ],
}

const onSubmit = async () => {
  await formRef.value?.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      // TODO: 等后端提供登录接口后对接
      // 示例：const { data } = await axios.post('/user/login', form)
      ElMessage.success('模拟登录成功')
      router.push('/register')
    } catch (error: any) {
      ElMessage.error(error?.response?.data?.message || '登录失败')
    }
  })
}
</script>

<template>
  <el-card class="card">
    <template #header>
      <div class="card-header">登录</div>
    </template>
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" type="password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">登录</el-button>
        <el-button link @click="$router.push('/register')">去注册</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  
</template>

<style scoped>
.card {
  max-width: 420px;
  margin: 60px auto;
}
.card-header {
  font-weight: 600;
}
</style>



