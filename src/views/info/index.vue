<template>
  <div class="page-container">
    <div class="page-container__search">
      <el-form inline label-position="top" :model="formData">
        <el-form-item label="用户id">
          <el-input
            class="search-width"
            v-model="formData.userId"
            placeholder="请输入用户id"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            class="search-width"
            v-model="formData.userName"
            placeholder="请输入用户名"
            clearable
          />
        </el-form-item>
        <el-form-item label="项目">
          <el-select class="search-width" v-model="formData.apikey" placeholder="请选择项目">
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
        <el-form-item label="错误类型">
          <el-select
            class="search-width"
            v-model="formData.type"
            placeholder="请选择错误类型"
            clearable
          >
            <el-option
              v-for="item in EVENT_TYPES"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报错时间">
          <el-date-picker
            class="search-width"
            v-model="formData.date"
            type="daterange"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="x"
            clearable
          />
        </el-form-item>
        <el-form-item class="page-container__btn">
          <el-button type="primary" @click="onSubmit">搜索</el-button>
          <el-button @click="onClear">重置</el-button>
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
        <el-table-column prop="apikey" label="项目编号" width="70"></el-table-column>
        <el-table-column prop="env" label="环境" width="60"></el-table-column>
        <el-table-column prop="type" label="错误类型" width="126"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="60"></el-table-column>
        <el-table-column prop="userId" label="用户id" width="160"></el-table-column>
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

      <el-pagination
        v-model:current-page="page.pageNum"
        v-model:page-size="page.pageSize"
        :page-sizes="[20, 30, 50, 100]"
        background
        layout="sizes, prev, pager, next"
        :total="page.totalCount"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <Dialog v-model:show="revertDialog" :id="id" @clear-id="clearId" />
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Dialog from './components/dialog/index.vue'
import { formatDate } from '@/utils/index'
import { fetchErrorList } from '@/api/info'
import { PROJECT_LIST, ENV_LIST, EVENT_TYPES } from '@/const/index'

const formInit = {
  userId: void 0,
  userName: void 0,
  type: void 0,
  apikey: '',
  env: '',
  date: []
}

const formData = reactive({
  ...formInit
})
const page = reactive({
  pageNum: 1,
  pageSize: 20,
  totalCount: 0
})
const tableData = ref([])
const id = ref('')
const revertDialog = ref(false)

const route = useRoute()

onMounted(() => {
  if (route.query.id) {
    openDetail({ id: route.query.id })
  }
  getTableData()
})

const getTableData = () => {
  const params = {
    ...formData,
    ...page
  }
  if (params.date.length) {
    params['start'] = params.date[0]
    params['end'] = params.date[1]
  } else {
    params['start'] = void 0
    params['end'] = void 0
  }
  fetchErrorList(params).then(({ data }) => {
    page.totalCount = data.totalCount
    tableData.value = data.list
  })
}

const openDetail = ({ id: itemId }) => {
  id.value = itemId
  revertDialog.value = true
}

const handleSizeChange = (val) => {
  console.log(`${val} items per page`)
  getTableData()
}
const handleCurrentChange = (val) => {
  console.log(`current page: ${val}`)
  getTableData()
}
const onSubmit = () => {
  getTableData()
}
const onClear = () => {
  Object.assign(formData, formInit)
  getTableData()
}
const clearId = () => {
  id.value = ''
}
</script>

<style lang="less" scoped>
.table-wrap {
  width: 100%;
  height: calc(100% - 42px);
  padding-bottom: 12px;
}
.btn-list {
  .el-button {
    font-weight: normal !important;
  }
}
.el-pagination {
  float: right;
}
</style>
