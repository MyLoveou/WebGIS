<script setup>
import Map from 'ol/Map'
import View from 'ol/View'
import { onMounted, onBeforeUnmount, watch, reactive, nextTick } from 'vue'

// 定义双向绑定的 props
const map = defineModel('map')           // v-model:map
const selectform = defineModel('selectform') // v-model:selectform

const controls = reactive({
  scaleLine: null,
  overviewMap: null,
  zoom: null,
  rotate: null
})

// 初始化地图
const initMap = async () => {
  const newMap = new Map({
    target: 'base-map',
    view: new View({
      center: [114.61760630731898, -57.997879217038296],
      zoom: 8,
      projection: 'EPSG:3857'
    }),
    controls: []
  })
  console.log(newMap)
  map.value = newMap // ✅ 设置父组件 map
  await nextTick() // 等待响应式变量更新完成
  console.log(map.value)
  return newMap
}

const addControl = async (type) => {
  if (!map.value) return

  switch (type) {
    case 'scale':
      if (!controls.scaleLine) {
        const { default: ScaleLine } = await import('ol/control/ScaleLine')
        controls.scaleLine = new ScaleLine()
        map.value.addControl(controls.scaleLine)
      }
      break
    case 'overview':
      if (!controls.overviewMap) {
        const { default: OverviewMap } = await import('ol/control/OverviewMap')
        controls.overviewMap = new OverviewMap({ collapsed: false, collapseLabel: '\u00BB' })
        map.value.addControl(controls.overviewMap)
      }
      break
    case 'zoom':
      if (!controls.zoom) {
        const { default: Zoom } = await import('ol/control/Zoom')
        controls.zoom = new Zoom()
        map.value.addControl(controls.zoom)
      }
      break
    case 'rotate':
      if (!controls.rotate) {
        const { default: Rotate } = await import('ol/control/Rotate')
        controls.rotate = new Rotate()
        map.value.addControl(controls.rotate)
      }
      break
  }
}

const removeControl = (type) => {
  if (!map.value) return

  switch (type) {
    case 'scale':
      map.value.removeControl(controls.scaleLine)
      controls.scaleLine = null
      break
    case 'overview':
      map.value.removeControl(controls.overviewMap)
      controls.overviewMap = null
      break
    case 'zoom':
      map.value.removeControl(controls.zoom)
      controls.zoom = null
      break
    case 'rotate':
      map.value.removeControl(controls.rotate)
      controls.rotate = null
      break
  }
}

// 监听控件状态变化
watch(() => [...selectform.value], (newVal) => {
  const types = ['scale', 'overview', 'rotate', 'zoom']
  newVal.forEach((checked, i) => {
    checked ? addControl(types[i]) : removeControl(types[i])
  })
})

// 初始化
onMounted(() => {
  if (!map.value) {
    initMap()
    // console.log(map.value)
    console.log('地图初始化完成')
  }
})

onBeforeUnmount(() => {
  if (map.value) {
    Object.keys(controls).forEach(type => removeControl(type))
    map.value.setTarget(null)
  }
})
</script>

<template>
  <div class="map-container">
    <div id="base-map" class="map"></div>
    <div class="tool-panel">
      <div class="tool-header">地图控件</div>
      <div class="tool-body">
        <el-checkbox v-model="selectform[0]" label="比例尺控件" size="large" />
        <el-checkbox v-model="selectform[1]" label="鹰眼控件" size="large" />
        <el-checkbox v-model="selectform[2]" label="指北针控件" size="large" />
        <el-checkbox v-model="selectform[3]" label="缩放控件" size="large" />
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 80vh;

  .map {
    width: 100%;
    height: 80%;
    background: #f0f2f5;
  }

  .tool-panel {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.9);
    padding: 1rem;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);

    .tool-header {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #303133;
    }

    .tool-body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      :deep(.el-checkbox) {
        margin-right: 0;
      }
    }
  }
}

// 覆盖OpenLayers控件样式
:deep(.ol-control) {
  background: rgba(255, 255, 255, 0.8);

  button {
    background-color: #fff;

    &:hover {
      background-color: #f5f7fa;
    }
  }

  &.ol-rotate {
    top: 4em;
  }

  &.ol-overviewmap {
    bottom: 2.5em;
  }
}
</style>