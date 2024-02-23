<template>
  <div class="header" :class="{ moreHeader: collapse }">
    <div class="navbar">
      <div class="navbar-left">
        <el-icon :size="20" color="#666666" style="cursor: pointer" @click="changeCollapse">
          <DArrowRight v-if="collapse" />
          <DArrowLeft v-else />
        </el-icon>
      </div>
      <div class="navbar-right">123123</div>
    </div>
  </div>
</template>

<script setup>
import { useCollapseStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'

const store = useCollapseStore()

const { collapse } = storeToRefs(store)
const { changeCollapse } = store
</script>

<style lang="less" scoped>
.header {
  position: fixed;
  top: 0;
  right: 0;
  padding: 12px 16px;
  box-sizing: border-box;
  width: calc(100% - 210px);
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
  width: calc(100% - 64px);
}
</style>
