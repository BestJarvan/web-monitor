<template>
  <div class="main-wrap">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>

<style lang="less" scoped>
.main-wrap {
  padding: 60px 16px 16px 16px;
  width: 100%;
  background-color: #f2f2f2;
}
</style>
