import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const checkedCategories = ref([])
  const layers = ref({})

  const setLayer = (url, layer, category) => {
    layers.value[url] = { layer, category }; // 存储为对象属性

    // console.log('存储的图层', layers.value)
  };

  const getLayer = (url) => {
    return layers.value[url]?.layer; // 从对象中获取图层
  };

  const deleteLayer = (url) => {
    delete layers.value[url]; // 删除对象属性
  };

  return {
    checkedCategories,
    layers,
    setLayer,
    getLayer,
    deleteLayer
  }
},
  {
    // persist: true
  }
)