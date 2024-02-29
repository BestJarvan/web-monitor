<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <Transition name="sidebarLogoFade">
      <RouterLink v-if="props.collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img :src="logo" class="sidebar-logo" />
      </RouterLink>
      <RouterLink v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <img :src="name" class="sidebar-logo-name" />
      </RouterLink>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import logoImg from '@/assets/logo/logo.png'
import logoName from '@/assets/logo/name.png'

const props = defineProps(['collapse'])

const logo = ref(logoImg)
const name = ref(logoName)
</script>

<style lang="less" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter-from,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 84px;
  text-align: center;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    display: block;
    height: 1px;
    left: 20px;
    right: 20px;
    bottom: 0;
    // background-color: #bfcbd9;
  }

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: auto;
      height: 36px;
      vertical-align: middle;
      margin: 10px 0;
    }

    & .sidebar-title {
      margin: 0;
      color: #000000;
      font-weight: 600;
      font-size: 14px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
      padding-bottom: 36px;
    }
  }

  &.collapse {
    height: 56px;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.openSidebar .sidebar-logo-container .sidebar-logo-link {
  .sidebar-logo {
    margin: 24px 0;
  }
}

.sidebar-logo-name {
  width: auto;
  height: 36px;
  vertical-align: middle;
  margin: 24px 0 24px 17px;
}
</style>
