<script setup lang="ts"></script>

<template>
  <div style="padding: 24px">
    <nav style="margin-bottom: 16px">
      <router-link to="/login" style="margin-right: 12px">登录</router-link>
      <router-link to="/register">注册</router-link>
    </nav>
    <router-view />
  </div>
  
</template>

<style scoped></style>
