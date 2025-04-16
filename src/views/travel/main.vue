<script setup>
import { ref, watch } from 'vue';
import 'ol/ol.css';
import { Overlay } from 'ol';
import { Point } from 'ol/geom';
import { Feature } from 'ol';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Cluster from 'ol/source/Cluster';
import { fromLonLat } from 'ol/proj';
import { Style, Circle, Fill, Stroke, Text } from 'ol/style';
import jsondata from '@/assets/data.json';
import BasseMap from '@/components/map.vue';
import Popup from '@/components/Popup.vue';

const map = ref(null);
const popupRef = ref(null);
const mapRef = ref(null);
let overlay = null;

const features = jsondata.map(item => {
  const feature = new Feature({
    geometry: new Point(fromLonLat([item.lon, item.lat])),
    data: item,
  });
  return feature;
});

const clusterSource = new Cluster({
  distance: 40,
  source: new VectorSource({ features }),
});

const clusterLayer = new VectorLayer({
  source: clusterSource,
  style: function (feature) {
    const features = feature.get('features');
    const size = features.length;
    let displayText = size.toString();
    // 当只有一个要素时，显示名称
    if (size === 1) {
      const data = features[0].get('data');
      displayText = data.name;
    }
    return new Style({
      image: new Circle({
        radius: 6, // 修改半径，增大一点视觉效果更好
        stroke: new Stroke({
          color: '#fff',
          width: 2, // 较宽的白色边框
        }),
        fill: new Fill({
          // 使用透明度稍微柔和一下效果，聚合和单个点使用不同颜色
          color: size > 1 ? 'rgba(51,153,204,0.6)' : 'rgba(51,204,51,0.6)',
        }),
      }),
      text: new Text({
        text: displayText,
        fill: new Fill({ color: '#333' }),
        stroke: new Stroke({ color: '#fff', width: 2 }),
        // 设置文字样式
        font: 'bold 12px sans-serif',
        // 将文字上移，使其显示在点的上方，可根据需求适当调整数值
        offsetY: -20,
      }),
    });
  },
});



const popupVisible = ref(false);
const item = ref(null);

function closePopup() {
  overlay.setPosition(undefined);
  popupVisible.value = false;
}

watch(map, (newMap) => {
  if (newMap) {
    newMap.addLayer(clusterLayer);

    // 初始化 Overlay，增加 offset，使得弹窗出现在点要素上方
    overlay = new Overlay({
      element: popupRef.value,
      autoPan: true,
      autoPanAnimation: { duration: 250 },
      offset: [0, -20]  // 向上偏移 20 像素
    });
    newMap.addOverlay(overlay);
    
    newMap.on('click', function(e) {
      const clickedFeatures = newMap.getFeaturesAtPixel(e.pixel);
      if (clickedFeatures && clickedFeatures.length) {
        const clusterFeatures = clickedFeatures[0].get('features');
        // 如果聚合中只有一个要素，则显示弹窗
        if (clusterFeatures.length === 1) {
          item.value = clusterFeatures[0].get('data');
          const coordinate = clusterFeatures[0].getGeometry().getCoordinates();
          overlay.setPosition(coordinate);
          popupVisible.value = true;
        } else {
          // 如果聚合要素数量大于1，则可以选择不显示弹窗
          closePopup();
        }
      } else {
        closePopup();
      }
    });
  }
});
</script>

<template>
  <!-- 地图组件 -->
  <BasseMap v-model:map="map" ref="mapRef"></BasseMap>
  <!-- 弹窗 Overlay DOM 元素 -->
  <div ref="popupRef" class="ol-popup">
    <!-- 弹窗内容组件 -->
    <Popup v-if="popupVisible" :item="item" />
  </div>
</template>

<style lang="less" scoped>
/* 弹窗的样式，利用 transform 调整，使得弹窗的底部中心对准点击点 */
.ol-popup {
  position: absolute;
  background-color: white;
  padding: 5px;
  border: 1px solid #ccc;
  transform: translate(-50%, -100%);
  /* 可根据需要添加阴影等效果 */
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  width: 200px;
  height: 40px;
}
</style>
