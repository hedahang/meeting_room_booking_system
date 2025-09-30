<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const key = computed(() => route.path)

const systemName = '会议室预定系统'
const userInfo = ref<any>(null)
const avatarUrl = computed(() => (userInfo.value?.headPic ? userInfo.value.headPic : ''))

onMounted(() => {
  try {
    const raw = localStorage.getItem('user_info')
    if (raw) userInfo.value = JSON.parse(raw)
  } catch {}
})

function goProfile() {
  router.push('/home/profile')
}
function logout() {
  try {
    localStorage.removeItem('token')
  } catch {}
  router.push('/login')
}
</script>
<template>
  <div class="app-wrapper">
    <!-- 左侧菜单栏 -->
    <div class="left-menu">
      <div class="logo">{{ systemName }}</div>
      <el-menu :default-active="route.path" class="menu" router>
        <el-menu-item index="/home/index">
          <el-icon><House /></el-icon>
          <span>会议室列表</span>
        </el-menu-item>
        <el-menu-item index="/home/history">
          <el-icon><Calendar /></el-icon>
          <span>预定历史</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <div class="top-nav">
        <div class="top-left"></div>
        <div class="top-right">
          <el-dropdown>
            <span class="el-dropdown-link avatar-wrapper">
              <el-avatar :size="32" :src="avatarUrl">U</el-avatar>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="goProfile">个人中心</el-dropdown-item>
                <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
      <!-- 内容区域 -->
      <section class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive>
              <component :is="Component" :key="key" />
            </keep-alive>
          </transition>
        </router-view>
      </section>
    </div>
  </div>
</template>
<style scoped lang="scss">
.app-wrapper {
  width: 100%;
  height: 100%;
  display: flex;

  .left-menu {
    width: 200px;
    background: #fff;
    border-right: 1px solid #ebeef5;
    display: flex;
    flex-direction: column;

    .logo {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      border-bottom: 1px solid #ebeef5;
    }

    .menu {
      border-right: none;
    }
  }

  .main-container {
    flex: 1;
    display: flex;
    flex-direction: column;

    .top-nav {
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      background: #fff;
      border-bottom: 1px solid #ebeef5;

      .top-left {
        font-weight: 700;
      }

      .top-right {
        .avatar-wrapper {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
        }
      }
    }

    .app-main {
      padding: 16px;
      flex: 1;
      overflow: auto;
      background: #f5f7fa;
    }
  }
}
</style>
