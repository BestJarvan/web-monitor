<template>
  <div class="page-container">
    <div class="page-container__search">
      <el-form inline label-position="top" :model="formData">
        <el-form-item label="用户id">
          <el-input
            class="search-width"
            v-model="formData.user"
            placeholder="请输入用户类型"
            clearable
          />
        </el-form-item>
        <el-form-item label="错误类型">
          <el-select
            class="search-width"
            v-model="formData.region"
            placeholder="请选择错误类型"
            clearable
          >
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="报错时间">
          <el-date-picker
            class="search-width"
            v-model="formData.date"
            type="date"
            placeholder="请选择报错时间"
            clearable
          />
        </el-form-item>
        <el-form-item class="page-container__btn">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-container__content">
      <el-table :data="tableData" stripe size="small" class="table-wrap">
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column
          prop="message"
          label="报错信息"
          min-width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="pageUrl"
          label="报错页面"
          min-width="300"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="time" label="报错时间" width="150">
          <template #default="{ row }">
            <span>{{ row.time ? formatDate(row.time) : row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="apikey" label="项目编号" width="80"></el-table-column>
        <el-table-column prop="type" label="错误类型" width="126"></el-table-column>
        <el-table-column prop="userId" label="用户id" width="80"></el-table-column>
        <el-table-column prop="deviceInfo" label="浏览器信息" width="100">
          <template #default="{ row }">
            <span>{{ row.deviceInfo.browser }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceInfo" label="操作系统" width="100">
          <template #default="{ row }">
            <span>{{ row.deviceInfo.os }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="operate" align="center" label="操作" width="80">
          <template #default="{ row }">
            <div class="btn-list">
              <el-button type="primary" link size="small" @click="openDetail(row)"
                >查看详情</el-button
              >
              <!-- <el-button size="small" v-if="row.breadcrumb" type="text" @click="revertBehavior(row)"
                >查看用户行为</el-button
              > -->
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" prop="recordScreenId" label="播放录屏" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.recordScreenId"
              size="small"
              type="primary"
              @click="playRecord(row.recordScreenId)"
              >播放录屏</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>
    </div>
  </div>
  <Dialog v-model:show="revertDialog" :item="item" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import Dialog from './components/dialog/index.vue'
import { formatDate } from '@/utils/index'
import { fetchErrorList } from '@/api/info'

const formData = reactive({
  user: '',
  region: '',
  date: ''
})

const tableData = ref([])
const item = ref({})
const revertDialog = ref(false)

onMounted(() => {
  getTableData()
})

const getTableData = () => {
  fetchErrorList().then(({ data }) => {
    tableData.value = data.sort((a, b) => b.time - a.time)
  })
}

const openDetail = (row) => {
  revertDialog.value = true
  item.value = row
}

const onSubmit = () => {
  getTableData()
}
</script>

<style lang="less" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
}
.btn-list {
  .el-button {
    font-weight: normal !important;
  }
}
</style>
