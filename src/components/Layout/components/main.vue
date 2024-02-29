<template>
  <div class="main-wrap" :class="{ moreMain: props.collapse }">
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
const props = defineProps(['collapse'])
</script>

<style lang="less" scoped>
.main-wrap {
  padding: 60px 16px 16px 226px;
  width: 100%;
  overflow-x: hidden;
  background-color: #f2f2f2;
  transition: padding 0.28s;
}
.moreMain {
  padding-left: 80px;
}
</style>
