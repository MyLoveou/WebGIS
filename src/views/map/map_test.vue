<script setup>
import { Map, View } from "ol";
import Tile from 'ol/layer/Tile';
import XYZ from "ol/source/XYZ";

import ChinaProvince from '@/assets/mapJson/ProvinceCity.json'

import { onMounted, ref } from "vue"
import { reactive } from 'vue'


// src\assets\mapJson\ProvinceCity.json
const BaseMap = ref(null) // 用于控制图层
const source = ref(new XYZ({})) // 用于更换底图
const bzSource = ref(new XYZ({})) // 用于控制标注图层


const key = '7ac5cf51b4e48d04973d355bcf270cc7'



// 用于选择地图中心选择器以及高亮显示指定部分
const showSelect = ref(false)
const selected = reactive({
  province: '',
  city: ''
})

const onShowSelect = () => {
  showSelect.value = !showSelect.value
}

const onCancelSelect = () => {
  selected.province = '',
    selected.city = ''
  showSelect.value = false
}


/////////////////////////////////////// 初始化 ///////////////////////////////////////
const tdMap = () => {
  source.value.setUrl(BaseMapoptions[0]['value'] + key);
};
const bzMap = () => {
  bzSource.value.setUrl();
}

const initMap = () => {
  const tiandiMap = new Tile({
    source: source.value,
    type: 'base'
  })
  const bzLayer = new Tile({
    source: bzSource.value,
    type: 'mark'
  })
  BaseMap.value = new Map({
    target: 'map',
    layers: [tiandiMap, bzLayer],
    view: new View({
      center: [13247019.404399557, 4721671.572580107],
      zoom: 3,
    }),
  });
}

/////////////////////////////////////// 初始化 ///////////////////////////////////////


onMounted(() => {
  console.log(1)
  initMap();
  tdMap();

})

/////////////////////////////////////// 更换底图和标注 ///////////////////////////////////////

const BaseMapvalue = ref('')
const Markvalue = ref('')
const BaseMapoptions = [
  {
    value: 'http://t{1-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '矢量地图',
  },
  {
    value: 'http://t{1-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '影像底图',
  },
  {
    value: '',
    label: ''
  }
]

const MarkOptions = [
  {
    value: 'https://t{1-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '矢量中文标记'
  },
  {
    value: 'https://t{1-7}.tianditu.gov.cn/eva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=eva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '矢量英文标记'
  },
  {
    value: 'https://t{1-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '卫星中文标记'
  },
  {
    value: 'https://t{1-7}.tianditu.gov.cn/eia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=eia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=',
    label: '卫星英文标记'
  },
  {
    value: '',
    label: ''
  }
]

const ChangeBaseMap = (value) => {
  const layers = BaseMap.value.getLayers();
  const baseLayer = layers.getArray().find(layer => layer.get('type') === 'base');
  if (value) {
    if (baseLayer) {
      baseLayer.getSource().setUrl(value + key);
    } else {
      const newBaseLayer = new Tile({
        source: new XYZ({ url: value + key }),
        type: 'base'
      });
      BaseMap.value.addLayer(newBaseLayer);
    }
  } else if (baseLayer) {
    BaseMap.value.removeLayer(baseLayer);
  }
}

const ChangeMark = (value) => {
  const layers = BaseMap.value.getLayers();
  const markLayer = layers.getArray().find(layer => layer.get('type') === 'mark');
  if (value) {
    if (markLayer) {
      markLayer.getSource().setUrl(value + key);
    } else {
      const newMarkLayer = new Tile({
        source: new XYZ({ url: value + key }),
        type: 'mark'
      });
      BaseMap.value.addLayer(newMarkLayer);
    }
  } else if (markLayer) {
    BaseMap.value.removeLayer(markLayer);
  }
}

/////////////////////////////////////// 更换底图和标注 ///////////////////////////////////////

</script>

<template>
  <div class="home">
    <el-button class="btn" plain @click="showSelect = true">
      选择
    </el-button>

    <!-- <el-dialog v-model="showSelect" title="选择行政区划" width="500" :before-close="handleClose">  -->
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
      <!-- <el-button @click="ChangeBaseMap">更换地图</el-button>
      <el-button @click="ChangeMark">添加标注</el-button> -->
      <el-select v-model="BaseMapvalue" placeholder="底图选择" style="width: 140px" @change="ChangeBaseMap(BaseMapvalue)">
        <el-option v-for="item in BaseMapoptions" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled" />
      </el-select>
      <el-select v-model="Markvalue" placeholder="标记选择" style="width: 140px" @change="ChangeMark(Markvalue)">
        <el-option v-for="item in MarkOptions" :key="item.value" :label="item.label" :value="item.value"
          :disabled="item.disabled" />
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