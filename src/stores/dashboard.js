import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCollapseStore = defineStore('isCollapse', () => {
  const collapse = ref(false)
  function changeCollapse() {
    collapse.value = !collapse.value
    console.log('collapse: ', collapse.value, 12312312);
  }

  return { collapse, changeCollapse }
})
