<template>
  <div class="header" :class="{ moreHeader: props.collapse }">
    <div class="navbar">
      <div class="navbar-left">
        <el-icon :size="20" color="#666666" style="cursor: pointer" @click="changeCollapse">
          <DArrowRight v-if="props.collapse" />
          <DArrowLeft v-else />
        </el-icon>
      </div>
      <div class="navbar-right">
        <img class="avatar" :src="avatar" />
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['collapse'])
const emit = defineEmits(['changeCollapse'])
const avatar =
  'data:image/png;base64,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'

const changeCollapse = () => {
  emit('changeCollapse')
}
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 5;
  padding: 9px 16px;
  box-sizing: border-box;
  width: calc(100% - 211px);
  transition: width 0.28s;
  background-color: #ffffff;
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-left {
      display: flex;
      align-items: center;
    }
    &-right {
      display: flex;
      align-items: center;
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
  }
}
.moreHeader {
  width: calc(100% - 65px);
}
</style>
