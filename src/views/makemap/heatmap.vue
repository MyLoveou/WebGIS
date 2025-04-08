<script setup>
import { onMounted, ref, reactive, watch } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON' // 导入GeoJSON解析器
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'


import * as source from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'

import { ElMessage } from 'element-plus'


import BaseMap from '@/components/basemap.vue'
const map = ref(null)
// 修改折叠面板控制变量为数组，可以同时展开多个
const activeCollapse = ref(['1']);
const activeMapSource = ref([]); // 添加地图源折叠控制
// 添加图层管理数组
const maplayers = ref(new Map()) // 管理底图图层
const datalayers = ref(new Map()) // 管理数据图层


//////////////////// 选择底图 ////////////////////


const mapfileUpload = ref(null)
const checkedmap = ref([])
const mapfile = reactive([
  // { name, type, url }

])
const triggermapFileInput = () => {
  mapfileUpload.value.click()
}
const handlemapFileUpload = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    console.log('上传的文件:', file);
    // 清空已选文件防止重复触发
    e.target.value = null;
    const exists = mapfile.some(f => f.name === file.name);
    if (!exists) {
      mapfile.push({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.name.split('.').pop().toLowerCase() // 获取文件扩展
      })
      console.log('上传的文件信息:', mapfile[mapfile.length - 1])
    } else {
      ElMessage.warning('文件已存在')
    }
  }
}

const mapstyleselectshow = ref(false)


// 控制显示底图设置窗口
const handleMapCheckedChange = (item, checked) => {
  if (checked) {
    mapstyleselectshow.value = !mapstyleselectshow.value
  }
  if (!checked) {
    console.log(maplayers.value instanceof Map)
    const layer = maplayers.value.get(item.url)
    console.log(layer)
    map.value.removeLayer(layer)
    maplayers.value.delete(item.url);
  }
}


const geojsonmapSourceAdd = async () => {
  try {

    console.log('正在加载geojson文件');
    const url = checkedmap.value[checkedmap.value.length - 1]
    console.log('测试url', url)
    // 添加fetch获取实际数据
    const response = await fetch(url)
    const geojsonData = await response.json()
    let tempmapstyle = {}
    tempmapstyle = Object.assign(tempmapstyle, mapStyleOptions)
    const vectorSource = new source.Vector({
      features: new GeoJSON().readFeatures(geojsonData, {
        dataProjection: 'EPSG:4326', // 数据原始投影
        featureProjection: 'EPSG:3857' // 转换到地图投影
      })
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: {
        name: 'geojson',
        title: 'geojson数据'
      },
      style: (feature) => {
        const featureColor = feature.get('color') || tempmapstyle.backgroundColor; // 使用要素的color属性，如果没有则使用默认颜色
        return new Style({
          stroke: new Stroke({
            color: tempmapstyle.boundaryColor,
            width: tempmapstyle.boundaryWidth,
            opacity: tempmapstyle.opacity
          }),
          fill: new Fill({
            color: featureColor
          })
        });
      }
    })

    map.value.addLayer(vectorLayer)
    maplayers.value.set(url, vectorLayer)
    mapstyleselectshow.value = !mapstyleselectshow.value
    mapStyleOptions.boundaryColor = '#000000', // 默认边界颜色
      mapStyleOptions.boundaryWidth = 1, // 默认边界宽度
      mapStyleOptions.backgroundColor = '#ffffff' // 默认背景颜色
    // layers.value.set(URL, vectorLayer)
  } catch (error) {
    console.error('加载GeoJSON失败:', error);
    // 可以添加错误处理（例如显示通知）
  }

}



//////////////////// 选择底图 ////////////////////


//////////////////// 加载数据 ////////////////////


const datafileUpload = ref(null)
const datafile = ref([
  // { name, type, url }
])
const checkeddata = ref([])
const triggerdataFileInput = () => {
  datafileUpload.value.click()
}


const handledataFileUpload = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    console.log('上传的文件:', file);
    // 清空已选文件防止重复触发
    e.target.value = null;
    const exists = datafile.value.some(f => f.name === file.name);
    if (!exists) {
      datafile.value.push({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.name.split('.').pop().toLowerCase() // 获取文件扩展
      })
      console.log('上传的文件信息:', datafile.value)
    } else {
      ElMessage.warning('文件已存在')
    }
  }
}

const datastyleselectshow = ref(false)

const weightoptions = ref(null)
const checkedweight = ref(null)
const handleDataCheckedChange = async (item, checked) => {
  if (checked) {
    datastyleselectshow.value = !datastyleselectshow.value
    if (item.type == 'json' || item.type == 'geojson') {
      const response = await fetch(item.url)
      const geojsonData = await response.json()
      const properties = geojsonData.features[0].properties
      weightoptions.value = Object.keys(properties)
      console.log(weightoptions.value)
    }
  }
  if (!checked) {
    const layer = datalayers.value.get(item.url)

    map.value.removeLayer(layer)
    datalayers.value.delete(item.url);
  }
}

const jsondataSourceAdd = async () => {
  try {

    console.log('正在加载geojson文件');
    const url = checkeddata.value[checkeddata.value.length - 1]
    console.log('测试url', url)
    // 添加fetch获取实际数据
    const response = await fetch(url)
    const geojsonData = await response.json()

    const vectorSource = new VectorSource({
      features: new GeoJSON().readFeatures(geojsonData, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      })
    })
    let tempdatastyle = {}
    tempdatastyle = Object.assign(tempdatastyle, dataStyleOptions)
    const tempweight = checkedweight.value
    dataStyleOptions.radius = 50 // 设置半径
    dataStyleOptions.blur = 10 // 设置模糊度
    dataStyleOptions.weight = null // 设置字段
    dataStyleOptions.gradient = ['#00f', '#0ff', '#ff0', '#f00'] // 设置渐变
    dataStyleOptions.opacity = 0.7 // 设置透明度
    checkedweight.value = null

    const heatMapLayer = new Heatmap({
      source: vectorSource,
      radius: tempdatastyle.radius,
      blur: tempdatastyle.blur,
      gradient: tempdatastyle.gradient,
      opacity: tempdatastyle.opacity,
      weight: function (feature) {
        const data = feature.get(tempweight) || 0
        return Math.max(data, 0)
      }
    })

    map.value.addLayer(heatMapLayer)
    console.log('显示成功')
    datalayers.value.set(url, heatMapLayer)
    datastyleselectshow.value = !datastyleselectshow.value
    // layers.value.set(URL, vectorLayer)
  } catch (error) {
    console.error('加载GeoJSON失败:', error);
    // 可以添加错误处理（例如显示通知）
  }
}
//////////////////// 加载数据 ////////////////////



//////////////////// 底图样式设置 ////////////////////


const mapStyleOptions = reactive({
  boundaryColor: '#000000', // 默认边界颜色
  boundaryWidth: 1, // 默认边界宽度
  backgroundColor: '#ffffff', // 默认背景颜色
  opacity: 0.7 // 设置透明度
})

const handleMapStyleChange = (property, value) => {
  console.log(`修改的样式属性: ${property}, 新值: ${value}`);
  // 根据需要在这里更新地图样式
}

//////////////////// 底图样式设置 ////////////////////

//////////////////// 数据颜色和字段设置 ////////////////////

const dataStyleOptions = reactive({
  radius: 20, // 设置半径
  blur: 15, // 设置模糊度
  weight: null, // 设置字段
  gradient: ['#00f', '#0ff', '#ff0', '#f00'], // 设置渐变
  opacity: 0.3, // 设置透明度
})

const handleDataStyleChange = (property, value) => {
  console.log(`修改的样式属性: ${property}, 新值: ${value}`);
  // 根据需要在这里更新地图样式
}

const addGradientStop = () => {
  dataStyleOptions.gradient.push('#00ff00') // 默认添加绿色节点
}

const removeGradientStop = (index) => {
  dataStyleOptions.gradient.splice(index, 1)
}

//////////////////// 数据颜色和字段 ////////////////////

const controlStates = ref([true, false, true, false])
// const map = ref(null)

const handleMapInit = (basemap) => {
  map.value = basemap
  console.log('正在执行初始化')
  console.log(basemap)
  console.log(map.value)
  // 可以在此进行其他地图初始化操作
}

// 添加地图实例监听
watch(() => map.value, (newMap) => {
  if (newMap) {
    newMap.updateSize() // 确保地图尺寸正确
    console.log('地图实例已更新:', newMap)
  }
})
onMounted(() => {
  // 添加文件上传监听
  mapfileUpload.value.addEventListener('change', handlemapFileUpload);
  datafileUpload.value.addEventListener('change', handledataFileUpload);
  // map.value = new Map({})
  // map.value = new Map({
  //   target: 'map',
  //   layers: [], // 显式初始化图层数组
  //   view: new View({ // 使用View实例
  //     center: [114.61760630731898, -57.997879217038296],
  //     zoom: 4,
  //     projection: 'EPSG:3857' // 与数据投影一致
  //   })
  // })
})
</script>

<template>
  <el-container>
    <el-main>
      <!-- <div id="map"></div> -->
      <BaseMap v-model:map="map" v-model:selectform="controlStates"></BaseMap>
    </el-main>
    <el-aside width="240px">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="底图选择" name="1">
          <div class="checkbox-container">
            <el-collapse v-model="activeMapSource">
              <el-checkbox-group v-model="checkedmap">
                <div class="map-source-group">
                  <el-checkbox v-for="item in mapfile" :key="item.url" :value="item.url"
                    @change="(checked) => handleMapCheckedChange(item, checked)">

                    {{ item.name }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-collapse>
          </div>
        </el-collapse-item>
        <el-collapse-item title="数据选择" name="2">
          <div class="checkbox-container">
            <el-collapse v-model="activeMapSource">
              <el-checkbox-group v-model="checkeddata">
                <div class="map-source-group">
                  <el-checkbox v-for="item in datafile" :key="item.url" :value="item.url"
                    @change="(checked) => handleDataCheckedChange(item, checked)">

                    {{ item.name }}
                  </el-checkbox>
                </div>
              </el-checkbox-group>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="upload-container">
        <el-button @click="triggermapFileInput">选择底图文件</el-button>
        <input class="input-con" type="file" ref="mapfileUpload" style="display: none" accept=".geojson,.gpx,.json"
          @change="handlemapFileUpload" key="file-upload" />
      </div>
      <div class="upload-container">
        <el-button @click="triggerdataFileInput">选择数据文件</el-button>
        <input class="input-con" type="file" ref="datafileUpload" style="display: none" accept=".geojson,.json"
          @change="handledataFileUpload" key="file-upload" />
      </div>
    </el-aside>
  </el-container>
  <!-- 底图样式 -->
  <el-dialog v-model="mapstyleselectshow" title="底图样式设置" width="500" align-center>
    <el-form label-width="120px">
      <el-form-item label="边界颜色">
        <el-color-picker v-model="mapStyleOptions.boundaryColor"
          @change="(value) => handleMapStyleChange('boundaryColor', value)"></el-color-picker>
      </el-form-item>
      <el-form-item label="边界宽度">
        <el-input-number v-model="mapStyleOptions.boundaryWidth" :min="1" :max="10"
          @change="(value) => handleMapStyleChange('boundaryWidth', value)"></el-input-number>
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="mapStyleOptions.backgroundColor"
          @change="(value) => handleMapStyleChange('backgroundColor', value)"></el-color-picker>
      </el-form-item>
      <el-form-item label="透明度">
        <el-slider v-model="mapStyleOptions.opacity" :min="0" :max="1" :step="0.1" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="mapstyleselectshow = false">取消</el-button>
        <el-button type="primary" @click="geojsonmapSourceAdd">
          添加图层
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 数据点样式 -->
  <el-dialog v-model="datastyleselectshow" title="数据点样式设置" width="500" align-center>
    <el-select v-model="checkedweight" placeholder="选择字段" size="large" style="width: 240px">
      <el-option v-for="item in weightoptions" :key="item" :label="item" :value="item" />
    </el-select>
    <el-form label-width="120px">
      <!-- 渐变颜色设置 -->
      <div class="form-section">
        <h2 class="section-title">渐变颜色设置</h2>
        <div class="color-stops">
          <div v-for="(color, index) in dataStyleOptions.gradient" :key="index" class="color-stop-item">
            <el-form-item :label="`颜色节点 ${index + 1}`">
              <el-color-picker v-model="dataStyleOptions.gradient[index]" show-alpha />
              <el-button v-if="index > 0" type="danger" icon="Delete" circle @click="removeGradientStop(index)"
                class="remove-btn" />
            </el-form-item>
          </div>
        </div>
        <el-button type="primary" @click="addGradientStop" icon="Plus">添加颜色节点</el-button>
      </div>

      <!-- 其他设置 -->
      <div class="form-section">
        <h2 class="section-title">其他设置</h2>

        <el-form-item label="半径">
          <el-slider v-model="dataStyleOptions.radius" :min="0" :max="20" />
        </el-form-item>

        <el-form-item label="模糊度">
          <el-slider v-model="dataStyleOptions.blur" :min="5" :max="30" />
        </el-form-item>

        <el-form-item label="透明度">
          <el-slider v-model="dataStyleOptions.opacity" :min="0" :max="1" :step="0.1" />
        </el-form-item>
      </div>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="datastyleselectshow = false">取消</el-button>
        <el-button type="primary" @click="jsondataSourceAdd">添加图层</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>
#map {
  /* 使用ID选择器 */
  width: 100%;
  height: 80vh;
}

.el-aside {
  display: flex;
  flex-direction: column;
  position: relative;

  :deep(.el-collapse) {
    flex: 1;
    overflow: auto;
  }
}

.upload-container {
  padding: 10px;
  border-top: 1px solid #ebeef5;
  background: white;
  position: sticky;
  bottom: 0;
}

.input-con {
  width: 100%;
  margin-top: auto;
}

.Selectform {
  top: 20px;
  left: 20px;
  position: absolute;
  width: 400px;
  height: 400px;
  z-index: 120;
}

.checkbox-container {
  padding: 15px; // 调整内边距使其更适合折叠面板
}


.map-source-group {
  padding: 10px 0;
  display: flex;
  flex-direction: column;
}

:deep(.el-collapse-item__content) {
  padding-bottom: 10px;
}

:deep(.el-collapse) {
  border: none;
}

:deep(.el-collapse-item__wrap) {
  border: none;
}

:deep(.el-collapse-item__header) {
  font-weight: bold;
  padding-left: 10px;
  border: none;
}

// 内部折叠面板样式调整
:deep(.el-collapse .el-collapse) {
  margin: 0 -10px;

  .el-collapse-item__header {
    padding-left: 20px;
    font-size: 14px;
  }

  .el-collapse-item__content {
    padding-left: 20px;
  }
}


.mapstyle {
  position: absolute;
  background-color: black;
}


.form-section {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 4px;

  .section-title {
    margin-top: 0;
    color: #666;
    font-size: 16px;
  }
}

.color-stop-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  .el-form-item {
    margin-bottom: 0;
    flex: 1;
  }

  .remove-btn {
    margin-left: 10px;
  }
}

.dialog-footer {
  text-align: right;
}
</style>