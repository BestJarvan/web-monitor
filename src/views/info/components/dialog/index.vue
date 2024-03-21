<template>
  <el-drawer
    :model-value="show"
    title="日志详情"
    class="drawer-container"
    size="1260"
    destroy-on-close
    :before-close="handleClose"
  >
    <el-skeleton :rows="10" :loading="loadContent" animated>
      <template #default>
        <div class="wrap">
          <el-row :gutter="20">
            <el-col :span="18">
              <div class="wrap-line top custom">
                <div class="top-left">
                  <div class="title">Error</div>

                  <div class="content">
                    <div class="label">Name:</div>
                    <div class="value">{{ detailData.type }}</div>
                  </div>
                  <div class="content">
                    <div class="label">Message:</div>
                    <div class="value">
                      {{ detailData.message || '-' }}
                    </div>
                  </div>
                </div>
                <div class="top-right">
                  <el-button
                    v-if="detailData.recordScreenId"
                    type="primary"
                    link
                    @click="playRecord"
                    >播放录屏</el-button
                  >
                  <br />
                  <el-button v-if="detailData.recordScreenId" type="primary" link @click="ignoreMsg"
                    >忽略此类报错</el-button
                  >
                </div>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="wrap-line center custom">
                <div class="title">事件数</div>
                <i class="iconfont chart" @click="copyValue">&#xe602;</i>
                <div class="desc">{{ detailData.count }}次</div>
              </div>
            </el-col>
            <el-col :span="3">
              <div class="wrap-line center custom">
                <div class="title">用户数</div>
                <i class="iconfont chart" @click="copyValue">&#xe605;</i>
                <div class="desc">{{ detailData.userNum }}人</div>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="wrap-line">
                <div class="title">趋势图</div>
                <div
                  v-if="detailData.chartsList && detailData.chartsList.length"
                  ref="chartsRef"
                  class="content"
                ></div>
                <el-empty v-else description="暂无图表数据" />
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <div class="wrap-line">
                <div class="title">Information</div>

                <div class="content info">
                  <div class="box">
                    <i class="iconfont">&#xea0a;</i>
                    <div>
                      <p>Browser</p>
                      <p>
                        {{ detailData.deviceInfo.browser }}/{{
                          detailData.deviceInfo.browserVersion
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="box">
                    <i class="iconfont">&#xe611;</i>
                    <div>
                      <p>Os</p>
                      <p>{{ detailData.deviceInfo.os }}/{{ detailData.deviceInfo.osVersion }}</p>
                    </div>
                  </div>
                  <div class="box">
                    <i class="iconfont">&#xe745;</i>
                    <div>
                      <p>Device</p>
                      <p>
                        {{ detailData.deviceInfo.device }}/{{ detailData.deviceInfo.device_type }}
                      </p>
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
                          <i class="iconfont">{{
                            row.status === 'ok' ? '&#xe627;' : '&#xe626;'
                          }}</i>
                        </el-icon>
                      </template>
                    </el-table-column>
                    <el-table-column prop="category" label="类型" width="140" />
                    <el-table-column prop="content" label="描述">
                      <template #default="{ row }">
                        <el-popover
                          placement="top-start"
                          :width="800"
                          trigger="hover"
                          :content="row.content"
                        >
                          <template #reference>
                            <span class="overflow value">{{ row.content }}</span>
                          </template>
                        </el-popover>
                      </template>
                    </el-table-column>
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
                    <span>{{ detailData.pageUrl }}</span>
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
                  <div class="source" v-if="htmlDom" v-html="htmlDom"></div>
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
                    <span>{{ detailData.deviceInfo.ua }}</span>
                    <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
                  </div>
                </div>

                <div class="content">
                  <div class="label">user</div>
                  <div class="value code">
                    <span>
                      { userName: {{ detailData.userName }}, userId: {{ detailData.userId }} }
                    </span>
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
                    <span>{{ detailData.sdkVersion }}</span>
                    <i class="iconfont pointer" @click="copyValue">&#xe80a;</i>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </el-skeleton>
    <template #footer>
      <div class="drawer-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-drawer>

  <el-dialog
    v-model="visible"
    title="播放录屏"
    width="900"
    top="7vh"
    destroy-on-close
    :before-close="handleCloseDialog"
  >
    <div v-if="visible" ref="revert" class="playBox"></div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleCloseDialog"> 关闭 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import rrwebPlayer from 'rrweb-player'
import 'rrweb-player/dist/style.css'
import { Chart } from '@antv/g2'
import { findCodeBySourceMap } from '@/utils/sourcemap'
import { formatDate } from '@/utils/index'
import { fetchErrorDetail, fetchRecordScreen, addExclude } from '@/api/info'
import { unzip } from '@/utils/recordScreen'
import { ElMessage } from 'element-plus'

const props = defineProps(['id', 'show'])
const emit = defineEmits(['update:show', 'clearId'])

const activities = ref([])
const htmlDom = ref('')
const chartsRef = ref(null)
const detailData = ref({})
const loadContent = ref(true)

let chart

watch(
  () => props.id,
  (val) => {
    if (val) {
      fetchDetail()
    }
  }
)

const fetchDetail = () => {
  if (!props.id) return
  fetchErrorDetail({ id: props.id }).then(({ data }) => {
    if (data) {
      detailData.value = data
      revertBehavior(data)
      ;['error', 'unhandledrejection'].includes(data.type) && revertCode(data)
      setTimeout(() => {
        loadContent.value = false
        nextTick(() => {
          initChart(data.chartsList)
        })
      }, 1000)
    } else {
      ElMessage.error('暂无详情数据')
      handleClose()
    }
  })
}

const initChart = (chartData) => {
  if (!chartData || !chartData.length) return
  chart = new Chart({
    container: chartsRef.value,
    width: 1137,
    height: 300
  })

  chart
    .data({
      value: chartData,
      transform: [
        {
          type: 'fold',
          fields: ['count', 'userNum'], // 展开字段集
          key: 'info', // key字段
          value: 'total' // value字段
        }
      ]
    })
    .encode('x', 'date')
    .encode('y', 'total')
    .encode('color', 'info')

  // .axis('y', {
  //   labelFormatter: (val) => Math.floor(val)
  // })

  chart.line().encode('shape', 'smooth')
  chart.point().encode('shape', 'point')

  chart.render()
}

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
}

const jumpUrl = () => {
  window.open(detailData.value.pageUrl)
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
  loadContent.value = true
  chart && chart.destroy()
  emit('update:show', false)
  emit('clearId')
}

const visible = ref(false)
const revert = ref(null)
let player

const playRecord = () => {
  fetchRecordScreen({ recordScreenId: detailData.value.recordScreenId }).then(({ data }) => {
    if (data) {
      const events = unzip(data)
      visible.value = true
      nextTick(() => {
        player = new rrwebPlayer({
          target: revert.value,
          props: {
            width: 870,
            events,
            UNSAFE_replayCanvas: true
          }
        })
      })
    } else {
      ElMessage.warning('暂无数据，请稍后重试~')
    }
  })
}

const ignoreMsg = () => {
  ElMessageBox.confirm('忽略后将不会收到此类错误信息，是否确定忽略?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      const params = {
        apikey: detailData.value.apikey,
        env: detailData.value.env,
        message: detailData.value.message
      }
      addExclude(params).then(({ msg }) => {
        ElMessage.success(msg)
      })
    })
    .catch(() => {})
}

const handleCloseDialog = () => {
  player.pause()
  revert.value = null
  visible.value = false
}
</script>

<style lang="less">
@shadow: {
  background: #fff;
  box-shadow: 0 6px 10px rgba(36, 37, 38, 0.08);
};
@ellipsis: {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
};
.drawer-container {
  background-color: #f2f2f2;
  padding: 0;
  .el-drawer__header {
    @shadow();
    margin-bottom: 0;
    padding: 12px 16px;
    border-bottom: 1px solid #eeeeee;
  }
  .el-drawer__footer {
    padding: 12px 16px;
    border-top: 1px solid #eeeeee;
    background-color: #ffffff;
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
      &.top {
        display: flex;
        justify-content: space-between;
        align-items: end;
      }
      &.center {
        text-align: center;
      }
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
          padding: 0 10px 10px;
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
          // @ellipsis();
        }
        .code {
          display: flex;
          align-items: center;
          overflow: hidden;
          background-color: #eee;
          padding: 2px 6px 2px 8px;
          border-radius: 4px;
          color: var(--el-color-primary);
          span {
            display: block;
            width: 100%;
            margin-right: 6px;
            @ellipsis();
          }
          .iconfont {
            width: 20px;
          }
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
.desc {
  margin-top: 4px;
  font-weight: normal;
}
.el-skeleton {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 20px;
}
.errdetail {
  padding-top: 10px;
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
.chart {
  font-size: 23px;
}
.pointer {
  cursor: pointer;
  margin: 0 4px;
  color: #eee;
}
.overflow {
  cursor: pointer;
}
.playBox {
  width: 100%;
  height: 660px;
}
.rr-player {
  margin: 0 auto;
}
.source {
  width: 100%;
  box-sizing: border-box;
}
.custom {
  height: 88px;
  .wrap-line {
    height: 88px;
  }
}
</style>
