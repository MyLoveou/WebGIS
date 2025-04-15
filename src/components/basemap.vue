<script setup>
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import Map from 'ol/Map'
import View from 'ol/View'
import { onMounted, onBeforeUnmount, watch, reactive, nextTick, ref } from 'vue'

import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import { Style, Circle, Fill, Stroke, Text } from 'ol/style'
import TileLayer from 'ol/layer/Tile'
// 该组件用于初始化地图对象以及添加各种控件，同时实现添加标注的功能



///////////////////////////// 添加控件 /////////////////////////////

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
        const baseLayer = map.value.getLayers().item(0)


        controls.overviewMap = new OverviewMap({
          collapseLabel: '\u00BB',
          layers: [new TileLayer({ source: baseLayer.getSource() })], // new TileLayer({ source: baseLayer.getSource() }),
          // 控件展开标识
          collapseLabel: '\u00BB',
          // 控件折叠标识
          label: '\u00AB',
          // 设置控件展开
          collapsed: false,
          // 若想让鹰眼控件显示在地图HTML(viewport)外面，则需要提供target元素
          target: document.getElementById('custome-overviewmap'),
          tipLabel: "收缩按钮",
        })
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
onMounted(async () => {
  if (!map.value) {
    await initMap()
    // console.log(map.value)
    console.log('地图初始化完成')
    map.value.on('click', (event) => { // 监听鼠标点击事件，添加标注
      addMarker(event.coordinate)
    })
  }
  console.log(selectform)
})

onBeforeUnmount(() => {
  if (map.value) {
    Object.keys(controls).forEach(type => removeControl(type))
    map.value.setTarget(null)
  }
})

///////////////////////////// 添加控件 /////////////////////////////





///////////////////////////// 添加标注 /////////////////////////////
const markerSource = ref(new VectorSource())
const markerLayer = ref(new VectorLayer({
  source: markerSource.value,
  style: new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({ color: '#ff4500' }),
      stroke: new Stroke({
        color: '#ffffff',
        width: 2
      })
    }),
    text: new Text({
      text: '', // 初始无文字
      font: '14px Calibri,sans-serif',
      fill: new Fill({ color: '#fff' }),
      backgroundFill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
      padding: [4, 4, 4, 4],
      offsetY: -20
    })
  })
}))

// 设置样式
const markstyle = reactive({
  text: '',
  font: '',
  fillcolor: '',

})

// 向图层添加标注
const addMarker = (coordinate) => {
  const marker = new Feature({
    geometry: new Point(coordinate),
    name: `标注${markerSource.value.getFeatures().length + 1}`,
    timestamp: new Date().toISOString()
  })
  // 动态设置文字样式
  marker.setStyle(new Style({
    text: new Text({
      text: marker.get('name'),
      font: '14px Calibri,sans-serif',
      fill: new Fill({ color: '#fff' }),
      backgroundFill: new Fill({ color: 'rgba(0,0,0,0.6)' }),
      padding: [4, 4, 4, 4],
      offsetY: -20
    })
  }))

  markerSource.value.addFeature(marker)
}

const markerstyleselectshow = ref(true) // 用于控制标注样式设置弹窗显隐
const markerstyleOptions = reactive({
  fontSize: '', // 字体大小
  fontColor: '', // 字体颜色
  fontFamily: '', // 字体
  newLayerName: '', // 新建图层名称
  markerlayer: '', // 
  stylemodel: '' // 样式模板
})

const handleMapStyleChange = (name, value) => {
  console.log(`${name}的新值为${value}`)
}
const markerlayers = ref([
  // { name, layer }
])

const newmarkercreate = ref(false)

const num = ref(1)
const handleChange = (value) => {
  console.log(value)
}
///////////////////////////// 添加控件 /////////////////////////////



</script>

<template>
  <div class="map-container">
    <div id="base-map" class="map"></div>
    <div v-show="selectform[1]" id="custome-overviewmap" class="overview">
      测试内容
    </div>
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
  <el-dialog v-model="markerstyleselectshow" title="标注样式设置" width="500" align-center>
    <el-form label-width="130px">
      <el-form-item label="字体大小">
        <el-input-number v-model="num" :min="1" :max="10" @change="handleChange" />
      </el-form-item>
      <el-form-item label="字体颜色">
        <el-color-picker v-model="markerstyleOptions.fontColor"
          @change="(value) => handleMapStyleChange('fontColor', value)" />
      </el-form-item>
      <el-form-item label="字体">
        <el-select v-model="markerstyleOptions.fontFamily" placeholder="请选择字体">
          <el-option label="Calibri" value="Calibri" />
          <el-option label="Arial" value="Arial" />
          <el-option label="Times New Roman" value="Times New Roman" />
        </el-select>
      </el-form-item>
      <div style="display: flex">
        <el-form-item label="选择标注图层">
          <el-select v-model="markerstyleOptions.markerlayer" style="width: 200px;" placeholder="请选择标注图层">
            <el-option label="Calibri" value="Calibri" />
            <el-option label="Arial" value="Arial" />
            <el-option label="Times New Roman" value="Times New Roman" />
          </el-select>
        </el-form-item>
        <el-button style="display: inline;" v-if="!newmarkercreate" type="primary"
          @click="newmarkercreate = !newmarkercreate">新建标注图层</el-button>
      </div>

      <div v-if="newmarkercreate" style="display: flex">
        <el-form-item label="新建标注图层名称">
          <el-input v-model="markerstyleOptions.newLayerName"
            @change="(value) => handleMapStyleChange('newLayerName', value)" />
        </el-form-item>
        <el-button v-if="newmarkercreate" type="primary" @click="newmarkercreate = !newmarkercreate">确定</el-button>
      </div>
      <el-form-item label="选择样式模板">
        <el-select v-model="markerstyleOptions.stylemodel" style="width: 200px;" placeholder="请选择样式模板">
          <el-option label="Calibri" value="Calibri" />
          <el-option label="Arial" value="Arial" />
          <el-option label="Times New Roman" value="Times New Roman" />
        </el-select>
      </el-form-item>

    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary">保存为自定义样式模板</el-button>
        <el-button @click="markerstyleOptions = false">取消</el-button>
        <el-button type="primary" @click="geojsonmapSourceAdd">
          添加
        </el-button>
      </div>
    </template>
  </el-dialog>

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
    .tool-header {
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: #303133;
    }

    .tool-body {
      display: flex;
      flex-direction: row;
      gap: 0.5rem;

      :deep(.el-checkbox) {
        margin-right: 0;
      }
    }
  }
}

// 覆盖OpenLayers控件样式
:deep(.ol-control) {
  // background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  button {
    // background-color: #fff;
    border: none;
    color: #333;
    border-radius: 4px;

    &:hover {
      background-color: #f5f7fa;
    }
  }
}

/* 默认控件透明度设置 */
:deep(.ol-control) {
  transition: background-color 0.3s ease;
  /* 动态效果 */
}

/* 比例尺控件 */
:deep(.ol-scale-line-custom) {
  left: 1em;
  bottom: 1em;
  background: rgba(255, 255, 255, 0.6);
  /* 半透明背景 */
  border: 1px solid #ccc;
  padding: 4px;

  .ol-scale-line-inner {
    position: absolute;
    border: 1px solid #000;
    border-top: none;
    padding: 2px;
    border-radius: 4px;
  }
}

/* 鹰眼控件样式 */
:deep(.ol-overviewmap-custom) {
  position: absolute;
  bottom: 3em;
  /* 增加 bottom 值，远离底图 */
  right: 1em;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
}

/* 指北针控件样式 */
:deep(.ol-rotate-custom) {
  position: absolute;
  top: 3em;
  /* 增加 top 值，远离底图 */
  left: 1em;
  border: 1px solid #ccc;
  background: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
}

/* 缩放控件样式 */
:deep(.ol-zoom-custom) {
  position: absolute;
  top: 100px;
  /* 调整 top 值，避免遮挡重点区域 */
  right: 100px;
  background: rgba(255, 255, 255, 0.7);
  /* 半透明背景 */
}

.overview {
  position: absolute;
  height: 160px;
  width: 170px;
  right: 0px;
  top: 10px;
}

// 地图控件动画
@keyframes controlEntrance {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.ol-control) {
  animation: controlEntrance 0.3s ease-out;
}
</style>