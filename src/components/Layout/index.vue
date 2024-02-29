<template>
  <div class="common-layout">
    <el-container>
      <Aside :collapse="collapse" />
      <el-container>
        <Header :collapse="collapse" @changeCollapse="changeCollapse" />
        <Main :collapse="collapse" />
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { useCollapseStore } from '@/stores/dashboard'
import { storeToRefs } from 'pinia'

import Aside from './components/aside.vue'
import Header from './components/header.vue'
import Main from './components/main.vue'

const store = useCollapseStore()

const { changeCollapse } = store
const { collapse } = storeToRefs(store)
</script>

<style lang="less" scoped>
.common-layout {
  position: relative;
  width: 100%;
  height: 100%;
}
.el-container {
  height: 100%;
}
</style>