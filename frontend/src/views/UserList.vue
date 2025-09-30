<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getUserList, freezeUser, type GetUserListParams, type UserListItem } from '@/api/user'

const loading = ref(false)
const tableData = ref<UserListItem[]>([])
const total = ref(0)
const query = reactive<GetUserListParams>({
  pageNo: 1,
  pageSize: 10,
  username: '',
  nickName: '',
  email: '',
})

async function fetchData() {
  loading.value = true
  try {
    const res = await getUserList(query)
    tableData.value = res.list
    total.value = res.totalCount
  } catch (e: any) {
    ElMessage.error(e?.message || '获取用户列表失败')
  } finally {
    loading.value = false
  }
}

function onSearch() {
  query.pageNo = 1
  fetchData()
}

function onPageChange(p: number) {
  query.pageNo = p
  fetchData()
}

function onSizeChange(s: number) {
  query.pageSize = s
  fetchData()
}

async function onToggleFreeze(row: UserListItem) {
  const target = !row.isFrozen
  await ElMessageBox.confirm(`确定要${target ? '冻结' : '解冻'}该账号吗？`, '提示', {
    type: 'warning',
  })
  try {
    await freezeUser(row.id, target)
    ElMessage.success(target ? '冻结成功' : '解冻成功')
    fetchData()
  } catch (e: any) {
    ElMessage.error(e?.message || '操作失败')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="user-list-page">
    <el-card shadow="never">
      <div class="toolbar">
        <el-input v-model="query.username" placeholder="用户名" clearable style="width: 180px" />
        <el-input v-model="query.nickName" placeholder="昵称" clearable style="width: 180px" />
        <el-input v-model="query.email" placeholder="邮箱" clearable style="width: 220px" />
        <el-button type="primary" @click="onSearch">查询</el-button>
      </div>

      <el-table :data="tableData" v-loading="loading" style="width: 100%">
        <el-table-column type="index" label="#" width="60" />
        <el-table-column label="头像" width="90">
          <template #default="{ row }">
            <el-image
              :src="row.headPic"
              fit="cover"
              style="width: 36px; height: 36px; border-radius: 50%"
              :preview-src-list="[row.headPic]"
              :preview-teleported="true"
            >
              <template #error>
                <div class="avatar-fallback">U</div>
              </template>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="150" />
        <el-table-column prop="nickName" label="昵称" width="150" />
        <el-table-column prop="email" label="邮箱" width="220" />
        <el-table-column prop="phoneNumber" label="手机号" width="150" />
        <el-table-column prop="isFrozen" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="row.isFrozen ? 'danger' : 'success'">{{
              row.isFrozen ? '已冻结' : '正常'
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" fixed="right">
          <template #default="{ row }">
            <el-button type="warning" link @click="onToggleFreeze(row)">{{
              row.isFrozen ? '解冻' : '冻结'
            }}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pager">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50]"
          :page-size="query.pageSize || 10"
          :current-page="query.pageNo || 1"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.user-list-page {
  .toolbar {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  .pager {
    margin-top: 12px;
    display: flex;
    justify-content: flex-end;
  }
  :deep(.avatar-fallback) {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #f2f3f5;
    color: #909399;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
  }
}
</style>
