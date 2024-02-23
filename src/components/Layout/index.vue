<template>
  <div class="common-layout">
    <el-container>
      <Aside />
      <el-container>
        <Header />
        <Main />
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import Aside from './components/aside.vue'
import Header from './components/header.vue'
import Main from './components/main.vue'
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