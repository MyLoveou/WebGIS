<script setup>
import Map from 'ol/Map'
import View from 'ol/View'
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer'
import { ref, onMounted, reactive } from 'vue'
import XYZ from "ol/source/XYZ"
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style.js'
import * as source from 'ol/source';
import * as format from 'ol/format';
import { defaults as defaultControls, MousePosition } from 'ol/control';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON.js'

import { ElMessage } from 'element-plus'

//////////////////////////////////// 添加图层 ////////////////////////////////////
const layermap = ref(null)
let layer = null;

// 添加图层管理数组
const layers = ref(new Map());
const TDkey = '7ac5cf51b4e48d04973d355bcf270cc7'
const GDkey = 'c550866e13a1bffee4884e734820dfc6'

// 添加图层函数
// 修改添加图层函数，添加图层管理
const AddLayer = (item, key, category, checked) => {
  if (checked) {
    // 添加新图层
    const layer = new TileLayer({
      source: new XYZ({
        url: item.value + key,
        projection: 'EPSG:4326',  // 修改为与地图相同的投影
      }),
      properties: {
        center: [114.61760630731898, -57.997879217038296],
      }
    })
    layermap.value.addLayer(layer)
    layers.value.set(item.value, layer);
    // 新增：更新视图中心
    // const view = layermap.value.getView();
    // view.setCenter(layer.getProperties().center);
    // view.setZoom(8); // 保持原有缩放级别

  } else {
    // 移除已有图层
    const layer = layers.value.get(item.value);
    if (layer) {
      layermap.value.removeLayer(layer)
      layers.value.delete(item.value);
    }
  }
}

// 修改选择变化处理函数
const handleCheckedChange = (item, category, checked) => {
  // console.log(mapStore.checkedCategories)
  if (category === '天地图') {
    AddLayer(item, TDkey, category, checked)
  }
  if (category === '高德地图') {
    AddLayer(item, GDkey, category, checked)
  }
  if (category === 'arcgis地图') {
    AddLayer(item, '', category, checked)
  }
  else {
    console.log(item.value)
    console.log(item.type)
    if (item.type == 'json') {
      creatGeojsonLayer(item.value, checked)
    }
    if (item.type == 'gpx') {
      createGPXLayer(item.value, checked)
    }

  }
};

//////////////////////////////////// 添加图层 ////////////////////////////////////




//////////////////////////////////// 侧边栏实现 ////////////////////////////////////
const sourcedata = reactive({
  '天地图': [
    {
      value: 'http://t{1-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
      label: '矢量地图',
    },
    {
      value: 'http://t{1-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
      label: '影像底图',
    },
    {
      value: 'https://t{1-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
      label: '矢量中文标记'
    },
    {
      value: 'https://t{1-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
      label: '卫星中文标记'
    },
  ],
  '高德地图': [
    {
      value: 'http://webrd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scl=1&style=8&lstyle=7&x={x}&y={y}&z={z}&key=',
      label: '高德地图'
    },
  ],
  'arcgis地图': [
    {
      value: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      label: 'arcgis地图'
    }
  ],
  'open地图': [
    // value,label,type
  ]
})


// 多级选择框数据
// 修改 checkedCategories 的初始值
const checkedCategories = ref([])

// 修改折叠面板控制变量为数组，可以同时展开多个
const activeCollapse = ref(['1']);
const activeMapSource = ref(['tianditu']); // 添加地图源折叠控制

//////////////////////////////////// 侧边栏实现 ////////////////////////////////////



//////////////////////////////////// 本地文件上传和显示 ////////////////////////////////////


const fileUpload = ref(null)

// 添加文件上传处理
const handleFileUpload = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    const file = files[0];
    console.log('上传的文件:', file);
    // 清空已选文件防止重复触发
    e.target.value = null;
    const exists = sourcedata['open地图'].some(f => f.label === file.name);
    if (!exists) {
      sourcedata['open地图'].push({
        value: URL.createObjectURL(file),
        label: file.name,
        type: file.name.split('.').pop().toLowerCase() // 获取文件扩展
      })
      console.log('上传的文件信息:', sourcedata['open地图'])
    } else {
      ElMessage.warning('文件已存在')
    }
  }
};


// 加载GPX文件
const createGPXLayer = (URL, checked) => {

  if (checked) {
    // 清理现有GPX图层
    console.log('正在显示GPX图层')
    layermap.value.getLayers().forEach(layer => {
      if (layer.get('name') === 'gpx') {
        layermap.value.removeLayer(layer);
      }
    })

    const style = {
      'Point': new Style({
        image: new CircleStyle({
          fill: new Fill({
            color: 'rgba(255,255,0,0.4)',
          }),
          radius: 5,
          stroke: new Stroke({
            color: '#ff0',
            width: 1,
          }),
        }),
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: '#f00',
          width: 3,
        }),
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: '#0f0',
          width: 3,
        }),
      }),
    }
    const vectorSource = new source.Vector({
      url: URL,
      format: new format.GPX(),

    })
    // 配置坐标系转换
    vectorSource.setLoader(function (extent, resolution, projection) {
      const parser = new format.GPX();
      fetch(URL)
        .then(response => response.text())
        .then(text => {
          const features = parser.readFeatures(text, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326'
          });
          vectorSource.addFeatures(features);
        });
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: {
        name: 'gpx',
        title: 'GPX数据'
      },
      style: function (feature) {
        return style[feature.getGeometry().getType()];
      }
    });

    vectorSource.on('addfeature', function () {
      const extent = vectorSource.getExtent();
      if (extent[0] !== Infinity) {
        layermap.value.getView().fit(extent, {
          padding: [100, 100, 100, 100],
          duration: 1000
        });
      }
    });

    layermap.value.addLayer(vectorLayer);
    layers.value.set(URL, vectorLayer);
  } else {
    // 移除已有图层
    const layer = layers.value.get(URL);
    if (layer) {
      layermap.value.removeLayer(layer)
      layers.value.delete(URL);
    }
  }

  // layermap.value.getView().fit(bounds, layermap.value.getSize());
}


// 加载geojson文件
const creatGeojsonLayer = (URL, checked) => {
  if (checked) {
    const vectorSource = new source.Vector({
      url: URL,
      format: new GeoJSON({
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:3857'
      }),
      // // 添加坐标系转换配置
      // loader: function (extent, resolution, projection) {
      //   fetch(URL)
      //     .then(response => response.json())
      //     .then(data => {
      //       const features = new format.GeoJSON().readFeatures(data, {
      //         dataProjection: 'EPSG:4326',    // 原始坐标系
      //         featureProjection: 'EPSG:3857'
      //       });
      //       console.log(data)
      //       vectorSource.addFeatures(features);

      //       // 自动适配视图范围
      //       const extent = vectorSource.getExtent();
      //       if (extent[0] !== Infinity) {
      //         layermap.value.getView().fit(extent, {
      //           padding: [50, 50, 50, 50],
      //           duration: 1000
      //         });
      //       }
      //     });
      // }
    })

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      properties: {
        name: 'geojson',
        title: 'geojson数据'
      },
      style: new Style({
        stroke: new Stroke({
          color: '#3672af',
          width: 1
        })
      })
    })

    layermap.value.addLayer(vectorLayer)
    layers.value.set(URL, vectorLayer)
  } else {
    // 移除已有图层
    const layer = layers.value.get(URL);
    if (layer) {
      layermap.value.removeLayer(layer)
      layers.value.delete(URL);
    }
  }
}
//////////////////////////////////// 本地文件上传和显示 ////////////////////////////////////



//////////////////////////////////// onMounted ////////////////////////////////////


onMounted(() => {
  // console.log(mapStore.layers)
  // 添加文件上传监听
  fileUpload.value.addEventListener('change', handleFileUpload);


  layermap.value = new Map({
    target: 'map',
    // layers: [layer],
    view: new View({
      // 北京 为中心
      center: [114.61760630731898, -57.997879217038296],
      zoom: 8,
      projection: 'EPSG:4326',
    }),
    // 鼠标控件：鼠标在地图上移动时显示坐标信息。
    controls: defaultControls().extend([
      // 加载鼠标控件
      new MousePosition()
    ])
  });
});

//////////////////////////////////// onMounted ////////////////////////////////////

</script>

<template>
  <div class="home">
    <el-container class="aside-main">
      <el-main>
        <div id="map" class="map" tabindex="0"></div>
      </el-main>
      <el-aside width="200px">
        <el-collapse v-model="activeCollapse">
          <el-collapse-item title="图层选择" name="1">
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
        <input type="file" ref="fileUpload" accept=".tif,.tiff,.geojson,.topojson,.gpx,.kml,.gml,.json"
          @change="handleFileUpload" key="file-upload" />
        <!-- <el-button type="primary" @click="handleUploadClick" style="margin-top: 10px;">
          上传本地文件

        </el-button> -->
      </el-aside>
    </el-container>
  </div>
</template>

<style lang="less" scoped>
.map {
  width: 100%;
  height: 80vh;
}

.btn {
  position: absolute;
  z-index: 100;
  right: 0;
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