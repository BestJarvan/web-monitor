<template>
  <el-dialog
    :model-value="props.show"
    :title="props.dialogTitle"
    width="700"
    destroy-on-close
    :before-close="handleClose"
  >
    <el-timeline>
      <el-timeline-item
        v-for="(activity, index) in props.activities"
        :key="index"
        :icon="activity.icon"
        :color="activity.color"
        :timestamp="formatDate(activity.time)"
      >
        {{ activity.content }}
      </el-timeline-item>
    </el-timeline>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { formatDate } from '@/utils/index'

const props = defineProps(['activities', 'dialogTitle', 'show'])
const emit = defineEmits(['update:show'])

const handleClose = () => {
  emit('update:show', false)
}
</script>

<style lang="less" scoped>
</style>
