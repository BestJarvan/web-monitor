<template>
  <div class="aside" :class="{ minAside: props.collapse }">
    <Logo :collapse="props.collapse" />
    <el-menu
      router
      :default-active="activeMenu"
      :collapse="props.collapse"
      :collapse-transition="false"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item index="/dashboard">
        <el-icon><SwitchFilled /></el-icon>
        <template #title>工作台</template>
      </el-menu-item>
      <el-menu-item index="/information">
        <el-icon><Aim /></el-icon>
        <template #title>报错信息</template>
      </el-menu-item>
      <!-- <el-sub-menu index="1">
        <template #title>
          <el-icon><Aim /></el-icon>
          <span>报错信息</span>
        </template>
        <el-menu-item index="1-3">item three</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="2">
        <el-icon><setting /></el-icon>
        <template #title>Navigator Four</template>
      </el-menu-item> -->
    </el-menu>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Logo from './logo.vue'

const route = useRoute()
const props = defineProps(['collapse'])

const activeMenu = computed(() => {
  if (route.meta.activeMenu) {
    return route.meta.activeMenu
  }
  return route.path
})

const handleOpen = (key, keyPath) => {
  console.log(key, keyPath)
}
const handleClose = (key, keyPath) => {
  console.log(key, keyPath)
}
</script>

<style lang="less" scoped>
.aside {
  position: fixed;
  left: 0;
  top: 0;
  width: 210px;
  height: 100%;
  z-index: 5;
  border-right: 1px solid #f2f2f2;
  background-color: #ffffff;
  transition: width 0.28s;
  &.minAside {
    width: 64px;
  }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 100%;
}
.el-menu {
  border: none;
}
</style>
