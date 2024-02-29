import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useCollapseStore = defineStore('isCollapse', () => {
  const storeVal = localStorage.getItem('MONITOR_IS_COLLAPSE')
  const collapse = ref(storeVal ? JSON.parse(storeVal) : false)
  function changeCollapse() {
    collapse.value = !collapse.value
    localStorage.setItem('MONITOR_IS_COLLAPSE', collapse.value)
  }

  return { collapse, changeCollapse }
})
