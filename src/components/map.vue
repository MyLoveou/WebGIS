<script setup>
// 该组件是用于旅游打卡系统的底图，只需要渲染POI数据到标签上即可
import { onMounted } from 'vue'
import * as source from 'ol/source'
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile } from 'ol/layer'
// 定义双向绑定的 props
const map = defineModel('map')           // v-model:map
const gaodeLayer = new Tile({
  source: new source.XYZ({
    title: "高德",
    url: "http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}&key=c550866e13a1bffee4884e734820dfc6"
  })
})
// 初始化地图
const initMap = async () => {
  const newMap = new Map({
    target: 'baseofmap',
    view: new View({
      center: [116.4074, -39.9042],
      zoom: 9,
      projection: 'EPSG:3857'
    }),
    layers: [gaodeLayer,]
    // controls: []
  })
  console.log(newMap)
  map.value = newMap // ✅ 设置父组件 map
  return newMap
}

onMounted(async () => {
  if (!map.value) {
    await initMap()
    console.log('地图初始化完成')
  }
})


</script>

<template>
  <div id="baseofmap" class="map"></div>
</template>

<style lang="less" scoped>
#baseofmap {
  width: 100%;
  height: 91vh;
}
</style>