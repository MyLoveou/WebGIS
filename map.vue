<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // console.log(mapStore.layers)
  // 添加文件上传监听
  // fileUpload.value.addEventListener('change', handleFileUpload);


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
</script>
<template>
  <div id="map" class="map" tabindex="0"></div>
</template>

<style scoped lang="less"></style>