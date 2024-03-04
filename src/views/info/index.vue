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
        <el-table-column prop="message" label="报错信息" width="300"></el-table-column>
        <el-table-column prop="pageUrl" label="报错页面" width="300"></el-table-column>
        <el-table-column prop="time" label="报错时间" width="150">
          <template #default="{ row }">
            <span>{{ row.time ? formatDate(row.time) : row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="apikey" label="项目编号"> </el-table-column>
        <el-table-column prop="userId" label="用户id"> </el-table-column>
        <el-table-column prop="sdkVersion" label="SDK版本"> </el-table-column>
        <el-table-column prop="deviceInfo" label="浏览器信息">
          <template #default="{ row }">
            <span>{{ row.deviceInfo.browser }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="deviceInfo" label="操作系统">
          <template #default="{ row }">
            <span>{{ row.deviceInfo.os }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" prop="recordScreenId" label="还原错误代码" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.type == 'error' || row.type == 'unhandledrejection'"
              type="primary"
              size="small"
              @click="revertCode(row)"
              >查看源码</el-button
            >
            <div v-else></div>
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
        <el-table-column fixed="right" prop="breadcrumb" label="用户行为记录" width="125">
          <template #default="{ row }">
            <el-button
              size="small"
              v-if="row.breadcrumb"
              type="primary"
              @click="revertBehavior(row)"
              >查看用户行为</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <Dialog
    v-model:show="revertDialog"
    :dialog-title="dialogTitle"
    :activities="activities"
    :html-dom="htmlDom"
  />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import Dialog from './components/dialog/index.vue'
import { formatDate } from '@/utils/index'
import { findCodeBySourceMap } from '@/utils/sourcemap'
import { fetchErrorList } from '@/api/info'

const formData = reactive({
  user: '',
  region: '',
  date: ''
})

onMounted(() => {
  getTableData()
})

const tableData = ref([])
const activities = ref([])
const htmlDom = ref('')
const dialogTitle = ref('')
const revertDialog = ref(false)

const getTableData = () => {
  setTimeout(() => {
    fetchErrorList()
      .then((response) => response.json())
      .then((res) => {
        tableData.value = res.data
      })
  }, 500)
}

const revertCode = (row) => {
  findCodeBySourceMap(row, (res) => {
    dialogTitle.value = '查看源码'
    revertDialog.value = true
    htmlDom.value = res
    activities.value = void 0
  })
}

const revertBehavior = ({ breadcrumb }) => {
  dialogTitle.value = '查看用户行为'
  revertDialog.value = true
  htmlDom.value = void 0
  breadcrumb.forEach((item) => {
    item.color = item.status == 'ok' ? '#5FF713' : '#F70B0B'
    item.icon = item.status == 'ok' ? 'el-icon-check' : 'el-icon-close'
    if (item.category == 'Click') {
      item.content = `用户点击dom: ${item.data}`
    } else if (item.category == 'Http') {
      item.content = `调用接口: ${item.data.url}, ${item.status == 'ok' ? '请求成功' : '请求失败'}`
    } else if (item.category == 'Code_Error') {
      item.content = `代码报错：${item.data.message}`
    } else if (item.category == 'Resource_Error') {
      item.content = `加载资源报错：${item.message}`
    } else if (item.category == 'Route') {
      item.content = `路由变化：从 ${item.data.from}页面 切换到 ${item.data.to}页面`
    }
  })
  activities.value = breadcrumb
}

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style lang="less" scoped>
.table-wrap {
  width: 100%;
  height: 100%;
}
</style>
