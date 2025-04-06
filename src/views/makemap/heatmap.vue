<script setup>
import { onMounted, ref, reactive } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON' // 导入GeoJSON解析器
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import HeatData from "@/assets/mapJson/all_month.json"

import * as source from 'ol/source';
import VectorLayer from 'ol/layer/Vector';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'

import { ElMessage } from 'element-plus'

const map = ref(null)
// 修改折叠面板控制变量为数组，可以同时展开多个
const activeCollapse = ref(['1']);
const activeMapSource = ref([]); // 添加地图源折叠控制
// 添加图层管理数组
const layers = ref(new Map());
const sourcedata = reactive({
  // { url, type, name }
})

const data = reactive({

})

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
      console.log('上传的文件信息:', mapfile[-1])
    } else {
      ElMessage.warning('文件已存在')
    }
  }
}

const mapstyleselectshhow = ref(false)


// 控制显示底图设置窗口
const handleMapCheckedChange = (item, checked) => {
  if (checked) {
    mapstyleselectshhow.value = !mapstyleselectshhow.value
  }
}


const geojsonSourceAdd = async () => {
  try {

    console.log('正在加载geojson文件');
    url = checkedmap.value[checkedmap.value.length - 1]
    // 添加fetch获取实际数据
    const response = await fetch(url)
    const geojsonData = await response.json()
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
        const featureColor = feature.get('color') || mapStyleOptions.backgroundColor; // 使用要素的color属性，如果没有则使用默认颜色
        return new Style({
          stroke: new Stroke({
            color: mapStyleOptions.boundaryColor,
            width: mapStyleOptions.boundaryWidth
          }),
          fill: new Fill({
            color: featureColor
          })
        });
      }
    })

    map.value.addLayer(vectorLayer)
    layers.value.set(url, vectorLayer)
    // layers.value.set(URL, vectorLayer)
  } catch (error) {
    console.error('加载GeoJSON失败:', error);
    // 可以添加错误处理（例如显示通知）
  }

}


//////////////////// 选择底图 ////////////////////


//////////////////// 加载数据 ////////////////////


const datafileUpload = ref(null)
const datafile = reactive([
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
    const exists = datafile.some(f => f.name === file.name);
    if (!exists) {
      datafile.push({
        url: URL.createObjectURL(file),
        name: file.name,
        type: file.name.split('.').pop().toLowerCase() // 获取文件扩展
      })
      console.log('上传的文件信息:', datafile[0])
    } else {
      ElMessage.warning('文件已存在')
    }
  }
}

const datastyleselectshhow = ref(false)

const handleDataCheckedChange = (item, checked) => {
  if (checked) {
    datastyleselectshhow.value = !datastyleselectshhow.value
  }
}

//////////////////// 加载数据 ////////////////////



//////////////////// 底图样式设置 ////////////////////


const mapStyleOptions = reactive({
  boundaryColor: '#000000', // 默认边界颜色
  boundaryWidth: 1, // 默认边界宽度
  backgroundColor: '#ffffff' // 默认背景颜色
})

const handleMapStyleChange = (property, value) => {
  console.log(`修改的样式属性: ${property}, 新值: ${value}`);
  // 根据需要在这里更新地图样式
}

//////////////////// 底图样式设置 ////////////////////

//////////////////// 数据颜色和字段设置 ////////////////////

const dataStyleOptions = reactive({
  boundaryColor: '#000000', // 默认边界颜色
  boundaryWidth: 1, // 默认边界宽度
  backgroundColor: '#ffffff' // 默认背景颜色
})

const handleDataStyleChange = (property, value) => {
  console.log(`修改的样式属性: ${property}, 新值: ${value}`);
  // 根据需要在这里更新地图样式
}

//////////////////// 数据颜色和字段 ////////////////////



onMounted(() => {
  // 添加文件上传监听
  mapfileUpload.value.addEventListener('change', handlemapFileUpload);
  datafileUpload.value.addEventListener('change', handledataFileUpload);

  // 创建热力图层
  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(HeatData, {
      dataProjection: 'EPSG:4326', // 数据原始投影
      featureProjection: 'EPSG:3857' // 转换到地图投影
    })
  })

  const heatMapLayer = new Heatmap({
    source: vectorSource,
    radius: 8,
    blur: 15,
    weight: function (feature) {
      const magnitude = feature.get('mag') || 0
      // console.log(magnitude)
      return Math.max(magnitude - 3, 0) // 确保权重非负
    }
  })
  console.log('正在创建热力图')
  map.value = new Map({
    target: 'map',
    layers: [], // 显式初始化图层数组
    view: new View({ // 使用View实例
      center: [114.61760630731898, -57.997879217038296],
      zoom: 4,
      projection: 'EPSG:3857' // 与数据投影一致
    })
  })
  map.value.addLayer(heatMapLayer)
})
</script>

<template>
  <el-container>
    <el-main>
      <div id="map"></div>
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
  <el-dialog v-model="mapstyleselectshhow" title="底图样式设置" width="500" align-center>
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
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="mapstyleselectshhow = false">取消</el-button>
        <el-button type="primary" @click="geojsonSourceAdd">
          添加图层
        </el-button>
      </div>
    </template>
  </el-dialog>
  <el-dialog v-model="datastyleselectshhow" title="数据点样式设置" width="500" align-center>
    <el-form label-width="120px">
      <el-form-item label="边界颜色">
        <el-color-picker v-model="dataStyleOptions.boundaryColor"
          @change="(value) => handleDataStyleChange('boundaryColor', value)"></el-color-picker>
      </el-form-item>
      <el-form-item label="边界宽度">
        <el-input-number v-model="dataStyleOptions.boundaryWidth" :min="1" :max="10"
          @change="(value) => handleMapStyleChange('boundaryWidth', value)"></el-input-number>
      </el-form-item>
      <el-form-item label="背景颜色">
        <el-color-picker v-model="dataStyleOptions.backgroundColor"
          @change="(value) => handleDataStyleChange('backgroundColor', value)"></el-color-picker>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="datastyleselectshhow = false">取消</el-button>
        <el-button type="primary" @click="datastyleselectshhow = false">
          添加图层
        </el-button>
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
</style>