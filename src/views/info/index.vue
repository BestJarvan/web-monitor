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
      <el-table :data="tableData" style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="message" label="报错信息" width="300"> </el-table-column>
        <el-table-column prop="pageUrl" label="报错页面"> </el-table-column>
        <el-table-column prop="time" label="报错时间" width="150">
          <template #default="{ row }">
            <span>{{ row.time ? format(row.time) : row.date }}</span>
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
              @click="revertCode(row)"
              >查看源码</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" prop="recordScreenId" label="播放录屏" width="100">
          <template #default="{ row }">
            <el-button
              v-if="row.recordScreenId"
              type="primary"
              @click="playRecord(row.recordScreenId)"
              >播放录屏</el-button
            >
          </template>
        </el-table-column> -->
        <el-table-column fixed="right" prop="breadcrumb" label="用户行为记录" width="125">
          <template #default="{ row }">
            <el-button v-if="row.breadcrumb" type="primary" @click="revertBehavior(row)"
              >查看用户行为</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'

const formData = reactive({
  user: '',
  region: '',
  date: ''
})

onMounted(() => {
  getTableData()
})

const tableData = ref([])

const getTableData = () => {
  setTimeout(() => {
    fetch(`http://localhost:8083/getErrorList`)
      .then((response) => response.json())
      .then((res) => {
        console.log('res.data: ', res.data)
        tableData.value = res.data
      })
  }, 500)
}
const format = (time) => {
  let str = new Date(time)
  return str.toLocaleDateString().replace(/\//g, '-') + ' ' + str.toTimeString().substr(0, 8)
}
const revertCode = () => {
  console.log('revertCode: ', 11)
}

const revertBehavior = () => {
  console.log('revertBehavior: ', 22)
}

const onSubmit = () => {
  console.log('submit!')
}
</script>

<style lang="less" scoped>
</style>
