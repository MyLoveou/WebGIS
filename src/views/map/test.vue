<script setup>
import { Map, View } from "ol";
import Tile from 'ol/layer/Tile';
import XYZ from "ol/source/XYZ";
import VectorTile from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';
import { onMounted, ref } from "vue"
import ChinaProvince from '@/assets/mapJson/ProvinceCity.json'
import { reactive } from 'vue'

const openMap = ref(null) // 用于控制图层
const source = ref(new XYZ({})) // 用于更换底图
const bzSource = ref(new VectorTileSource({ // 用于标注
  format: new MVT(),
  url: getBZUrl(1) // 假设默认显示矢量中文标记
}))

const key = '7ac5cf51b4e48d04973d355bcf270cc7'

const showSelect = ref(false)
const selected = reactive({
  province: '',
  city: ''
})

const onShowSelect = () => {
  showSelect.value = !showSelect.value
}

const onCancelSelect = () => {
  selected.province = ''
  selected.city = ''
  showSelect.value = false
}

const getSLUrl = (n) => {
  let url = ''
  switch (n) {
    case 1:
      url = 'http://t{1-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
      break;
    default: // 矢量底图
      url = 'http://t{1-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
  }
  return url + key;
}

const getBZUrl = (n) => {
  let url = '';
  switch (n) {
    case 1: // 矢量中文标记
      url = 'http://t{1-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
      break;
    case 2: // 矢量英文标记
      url = 'http://t{1-7}.tianditu.gov.cn/eva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=eva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
      break;
    case 3: // 卫星中文标记
      url = 'http://t{1-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
      break;
    default: // 卫星英文标记
      url = 'http://t{1-7}.tianditu.gov.cn/eia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=eia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=';
  }
  return url + key;
};

const tdMap = (n = 0) => {
  source.value.setUrl(getSLUrl(n));
};

const bzMap = (n = 1) => {
  bzSource.value.setUrl(getBZUrl(n));
};

const initMap = () => {
  const tiandiMap = new Tile({
    source: source.value,
  });

  const bzLayer = new VectorTile({ // 创建标注图层
    source: bzSource.value,
  });

  openMap.value = new Map({
    target: 'map',
    layers: [tiandiMap, bzLayer], // 同时添加底图和标注图层
    view: new View({
      center: [13247019.404399557, 4721671.572580107],
      zoom: 3,
    }),
  });
}

onMounted(() => {
  initMap();
  tdMap();
  bzMap();
})

const value = ref('')
const options = [
  {
    value: 'Option1',
    label: 'Option1',
  },
  {
    value: 'Option2',
    label: 'Option2',
    disabled: true,
  },
  {
    value: 'Option3',
    label: 'Option3',
  },
  {
    value: 'Option4',
    label: 'Option4',
  },
  {
    value: 'Option5',
    label: 'Option5',
  },
]

const ChangeBaseMap = (newValue) => {
  console.log("选择的值：", newValue);
  tdMap(newValue === 'Option1' ? 1 : 0);
  bzMap(newValue === 'Option3' ? 3 : newValue === 'Option4' ? 2 : 1);
}
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
    <div class="tool">
      <el-select v-model="value" placeholder="底图选择" style="width: 140px" @change="ChangeBaseMap">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.disabled" />
      </el-select>
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
