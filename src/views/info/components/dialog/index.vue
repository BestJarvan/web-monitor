<template>
  <el-dialog
    fullscreen
    :model-value="show"
    title="日志详情"
    class="dialog-container"
    destroy-on-close
    :before-close="handleClose"
  >
    <div class="wrap">
      <el-row :gutter="20">
        <el-col :span="18">
          <div class="wrap-line">
            <div class="title">Error</div>

            <div class="content">
              <div class="label">Name:</div>
              <div class="value">{{ item.type }}</div>
            </div>
            <div class="content">
              <div class="label">Message:</div>
              <div class="value">
                {{ item.message || '-' }}
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="wrap-line">2</div>
        </el-col>
        <el-col :span="3">
          <div class="wrap-line">3</div>
        </el-col>
      </el-row>
      <!-- <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">Echarts</div>
          </div>
        </el-col>
      </el-row> -->
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">Information</div>

            <div class="content info">
              <div class="box">
                <i class="iconfont">&#xea0a;</i>
                <div>
                  <p>Browser</p>
                  <p>{{ item.deviceInfo.browser }}/{{ item.deviceInfo.browserVersion }}</p>
                </div>
              </div>
              <div class="box">
                <i class="iconfont">&#xe611;</i>
                <div>
                  <p>Os</p>
                  <p>{{ item.deviceInfo.os }}/{{ item.deviceInfo.osVersion }}</p>
                </div>
              </div>
              <div class="box">
                <i class="iconfont">&#xe745;</i>
                <div>
                  <p>Device</p>
                  <p>{{ item.deviceInfo.device }}/{{ item.deviceInfo.device_type }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">Breadcrumb</div>

            <div class="content">
              <el-table
                :data="activities"
                header-row-class-name="table-header"
                max-height="300"
                border
                style="width: 99%"
              >
                <el-table-column prop="color" align="center" label="状态" width="60">
                  <template #default="{ row }">
                    <el-icon :style="{ color: row.color }">
                      <i class="iconfont">{{ row.status === 'ok' ? '&#xe627;' : '&#xe626;' }}</i>
                    </el-icon>
                  </template>
                </el-table-column>
                <el-table-column prop="category" label="类型" width="180" />
                <el-table-column prop="content" label="描述" />
                <el-table-column prop="time" fixed="right" label="操作时间" width="160">
                  <template #default="{ row }">
                    <span>{{ row.time ? formatDate(row.time) : row.date }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">URL</div>

            <div class="content">
              <div class="label">url</div>
              <div class="value code">
                <span>{{ item.pageUrl }}</span>
                <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
                <i class="iconfont pointer" @click="jumpUrl">&#xe601;</i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">SourceMap</div>

            <div class="content source">
              <div v-if="0"></div>
              <el-empty v-else description="暂无SourceMap数据" />
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">Header</div>
            <div class="content">
              <div class="label">ua</div>
              <div class="value code">
                <span>{{ item.deviceInfo.ua }}</span>
                <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
              </div>
            </div>

            <div class="content">
              <div class="label">token</div>
              <div class="value code">
                <span>{123123123123}</span>
                <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="wrap-line">
            <div class="title">SDK</div>
            <div class="content">
              <div class="label">Version</div>
              <div class="value code">
                <span>{{ item.sdkVersion }}</span>
                <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- <div v-if="htmlDom" v-html="htmlDom"></div>
    <el-timeline v-else>
      <el-timeline-item
        v-for="(activity, index) in activities"
        :key="index"
        :icon="activity.icon"
        :color="activity.color"
        :timestamp="formatDate(activity.time)"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline> -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from 'vue'
import { findCodeBySourceMap } from '@/utils/sourcemap'
import { formatDate } from '@/utils/index'
import { ElMessage } from 'element-plus'

const props = defineProps(['item', 'show'])
const emit = defineEmits(['update:show'])

const activities = ref([])
const htmlDom = ref('')

watch(
  () => props.item,
  (val) => {
    console.log('val: ', val)
    if (val) {
      revertBehavior(val)
      ;['error', 'unhandledrejection'].includes(val.type) && revertCode(val)
    }
  }
)

const revertCode = (row) => {
  findCodeBySourceMap(row, (res) => {
    htmlDom.value = res
  })
}

const revertBehavior = ({ breadcrumb }) => {
  breadcrumb.forEach((item) => {
    item.color = item.status == 'ok' ? '#5FF713' : '#F70B0B'
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
  console.log('activities.value : ', activities.value)
}

const jumpUrl = () => {
  window.open(props.item.pageUrl)
}

const copyValue = (e) => {
  const data = e.target.parentElement.firstChild.innerText
  const selection = window.getSelection()
  const range = document.createRange()
  const span = document.createElement('span')
  span.innerHTML = data
  span.style.position = 'absolute'
  span.style.top = '-1000px'
  span.style.zIndex = '-10'
  document.body.appendChild(span)
  range.selectNodeContents(span)
  selection.removeAllRanges()
  selection.addRange(range)

  const text = selection.toString()

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      ElMessage.success('复制成功!')
      document.body.removeChild(span)
    })
  }
}

const handleClose = () => {
  emit('update:show', false)
}
</script>

<style lang="less">
@shadow: {
  background: #fff;
  box-shadow: 0 6px 10px rgba(36, 37, 38, 0.08);
};
.dialog-container {
  background-color: #f2f2f2;
  padding: 0;
  .el-dialog__header {
    @shadow();
    padding: 12px 16px;
  }
  .el-dialog__footer {
    padding: 12px 16px;
  }
  .wrap {
    padding: 12px 16px;
  }
  .el-col {
    margin-bottom: 18px;
    .wrap-line {
      @shadow();
      padding: 18px;
      border-radius: 10px;
      .title {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 12px;
      }
      .content {
        display: flex;
        font-size: 14px;
        margin-bottom: 10px;
        &:last-child {
          margin-bottom: 0;
        }
        &.info {
          display: flex;
          justify-content: space-around;
          width: 100%;
          .box {
            text-align: center;
            .iconfont {
              font-size: 44px;
            }
            p:first-child {
              margin: 16px 0 6px;
              font-weight: bold;
            }
          }
        }
        &.source {
          min-height: 200px;
          .el-empty {
            width: 100%;
            text-align: center;
          }
        }
        .label {
          flex: 0 0 100px;
          font-weight: bold;
          width: 100px;
        }
        .value {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .code {
          background-color: #eee;
          padding: 2px 12px 2px 8px;
          border-radius: 4px;
          color: var(--el-color-primary);
        }
        .table-header > th {
          background-color: #fafafa !important;
        }
      }
    }
  }
}
.iconfont {
  cursor: default;
}
.errdetail {
  text-align: left;
  width: 100%;
  font-size: 16px;
}
.code-line {
  padding: 5px 0;
}
.heightlight {
  background-color: yellowgreen;
}
.errheader {
  padding: 10px;
  border-bottom: 1px solid rgb(214, 210, 210);
}
.pointer {
  cursor: pointer;
  margin: 0 4px;
  color: #eee;
}
</style>
