<template>
  <div class="header" :class="{ moreHeader: props.collapse }">
    <div class="navbar">
      <div class="navbar-left">
        <el-icon :size="20" color="#666666" style="cursor: pointer" @click="changeCollapse">
          <DArrowRight v-if="props.collapse" />
          <DArrowLeft v-else />
        </el-icon>
      </div>
      <div class="navbar-right">123123</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['collapse'])
const emit = defineEmits(['changeCollapse'])

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
  padding: 12px 16px;
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
  }
}
.moreHeader {
  width: calc(100% - 65px);
}
</style>
