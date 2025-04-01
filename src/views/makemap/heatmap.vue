<script setup>
import { onMounted, ref, reactive } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import GeoJSON from 'ol/format/GeoJSON' // 导入GeoJSON解析器
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer'
import Heatmap from 'ol/layer/Heatmap'
import VectorSource from 'ol/source/Vector'
import HeatData from "@/assets/mapJson/all_month.json"

const map = ref(null)
const fileUpload = ref(null)
// 修改折叠面板控制变量为数组，可以同时展开多个
const activeCollapse = ref(['1']);
const activeMapSource = ref([]); // 添加地图源折叠控制

const sourcedata = reactive({
  // url, type, label, 
})

const data = reactive({

})

//////////////////// 选择底图 ////////////////////



//////////////////// 选择底图 ////////////////////


//////////////////// 加载数据 ////////////////////



//////////////////// 加载数据 ////////////////////



//////////////////// 颜色设置 ////////////////////




//////////////////// 颜色设置 ////////////////////


onMounted(() => {

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
    <el-aside width="200px">
      <el-collapse v-model="activeCollapse">
        <el-collapse-item title="底图选择" name="1">
          <div class="checkbox-container">
            <el-collapse v-model="activeMapSource">
              <el-collapse-item v-for="(values, category) in sourcedata" :key="category" :title="category"
                :name="category">
                <el-checkbox-group v-model="checkedCategories">
                  <div class="map-source-group">
                    <el-checkbox v-for="item in values" :key="item.value" :value="item.value"
                      @change="(checked) => handleCheckedChange(item, category, checked)">
                      {{ item.label }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
        <el-collapse-item title="数据选择" name="2">
          <div class="checkbox-container">
            <el-collapse v-model="activeMapSource">
              <el-collapse-item v-for="(values, category) in sourcedata" :key="category" :title="category"
                :name="category">
                <el-checkbox-group v-model="checkedCategories">
                  <div class="map-source-group">
                    <el-checkbox v-for="item in values" :key="item.value" :value="item.value"
                      @change="(checked) => handleCheckedChange(item, category, checked)">
                      {{ item.label }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="upload-container">
        <input class="input-con" type="file" ref="fileUpload"
          accept=".tif,.tiff,.geojson,.topojson,.gpx,.kml,.gml,.json" @change="handleFileUpload" key="file-upload" />
      </div>
    </el-aside>
  </el-container>
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
  padding: 5px; // 调整内边距使其更适合折叠面板
}

.category-group {
  margin: 8px 0;
}

.map-source-group {
  padding: 5px 0;
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
</style>