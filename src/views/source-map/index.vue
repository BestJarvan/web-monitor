<template>
  <div class="page-container">
    <div class="page-container__search">
      <el-form inline label-position="top" :model="formData">
        <el-form-item label="项目">
          <el-select class="search-width" v-model="formData.project" placeholder="请选择项目">
            <el-option
              v-for="item in PROJECT_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="环境">
          <el-select class="search-width" v-model="formData.env" placeholder="请选择环境">
            <el-option
              v-for="item in ENV_LIST"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="上传时间">
          <el-date-picker
            class="search-width__date"
            v-model="formData.date"
            type="date"
            placeholder="请选择时间"
            clearable
          />
        </el-form-item> -->
        <el-form-item class="page-container__btn">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="page-container__content">
      <el-table :data="tableData" stripe class="table-wrap">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="project" label="项目编号"></el-table-column>
        <el-table-column prop="date" label="上传日期"> </el-table-column>

        <el-table-column fixed="right" prop="operate" align="center" label="操作" width="80">
          <template #default="{ row }">
            <div class="btn-list">
              <el-button type="primary" link @click="delItem(row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { PROJECT_LIST, ENV_LIST } from '@/const/index'
import { fetchMapFileList, delMapFile } from '@/api/source'

const formData = reactive({
  project: PROJECT_LIST[0].value,
  env: ENV_LIST[0].value,
  date: ''
})

const tableData = ref([])

onMounted(() => {
  getTableData()
})

const getTableData = () => {
  fetchMapFileList({ ...formData.value }).then(({ data }) => {
    tableData.value = data
  })
}

const delItem = (item) => {
  ElMessageBox.confirm('删除后不可撤销，确定删除?', '警示提示', {
    confirmButtonText: '删除',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delMapFile({ ...item }).then(({ msg }) => {
        ElMessage({
          type: 'success',
          message: msg
        })
      })
    })
    .catch(() => {})
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
