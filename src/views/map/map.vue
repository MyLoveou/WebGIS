<script setup>
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Image as ImageLayer } from 'ol/layer';
import { OSM, ImageStatic } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import * as GeoTIFF from 'geotiff';
import { ref, onMounted, reactive } from 'vue';

const tifUpload = ref(null);
const showSelect = ref(false);
const selected = reactive({
  province: '',
  city: ''
});

// 初始化地图
const map = new Map({
  target: 'map',
  layers: [new TileLayer({ source: new OSM() })],
  view: new View({
    center: fromLonLat([0, 0]),
    zoom: 2
  })
});

async function loadGeoTIFF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const bbox = image.getBoundingBox();
  const [minX, minY, maxX, maxY] = bbox;
  const width = image.getWidth();
  const height = image.getHeight();

  // 读取所有波段数据
  const { r, g, b, a } = await image.readRasters({
    interleave: true, // 获取交错排列的RGB数据
  });

  // 创建Canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // 创建ImageData
  const imageData = ctx.createImageData(width, height);
  
  // 填充像素数据（假设是RGB或RGBA格式）
  if (r && g && b) {
    for (let i = 0; i < width * height; i++) {
      imageData.data[4 * i] = r[i];     // R
      imageData.data[4 * i + 1] = g[i]; // G
      imageData.data[4 * i + 2] = b[i]; // B
      imageData.data[4 * i + 3] = a ? a[i] : 255; // A（透明度）
    }
  } else {
    // 单波段处理（灰度图）
    const data = await image.readRasters();
    for (let i = 0; i < width * height; i++) {
      const val = data[0][i];
      imageData.data[4 * i] = val;     // R
      imageData.data[4 * i + 1] = val; // G
      imageData.data[4 * i + 2] = val; // B
      imageData.data[4 * i + 3] = 255; // A
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return new ImageStatic({
    imageExtent: [minX, minY, maxX, maxY],
    imageSize: [width, height],
    projection: 'EPSG:4326',
    url: canvas.toDataURL()
  });
}
onMounted(() => {
  tifUpload.value.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const source = await loadGeoTIFF(file);
      map.addLayer(new ImageLayer({ source }));
      map.getView().fit(source.getImageExtent());
    } catch (error) {
      console.error('加载失败:', error);
    }
  });
});


</script>

<template>
  <div class="home">
    <el-button class="btn" plain @click="showSelect = true">
      选择
    </el-button>

    <el-dialog v-model="showSelect" title="选择行政区划" width="500">
      <el-select v-model="selected.province" placeholder="请选择省">
        <el-option v-for="(city, key) in ChinaProvince['00']" :key="key" :label="city" :value="key">
        </el-option>
      </el-select>
      <el-select v-model="selected.city" placeholder="请选择市">
        <el-option v-for="(city, key) in ChinaProvince[selected.province]" :key="key" :label="city" :value="key">
        </el-option>
      </el-select>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="onCancelSelect">取消</el-button>
          <el-button type="primary" @click="showSelect = false">
            确定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <div id="map" class="map" tabindex="0"></div>
    <input type="file" ref="tifUpload" accept=".tif,.tiff" />
    <div class="tool">


    </div>

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
</style>