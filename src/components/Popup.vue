<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  item: Object,
});
</script>

<template>
  <!-- <div class="popup-content">
    <p>{{ props.item.名称 }}</p>
    <p>{{ props.item.地址 }}</p>
  </div> -->
  <el-dialog class="popup-content" title="Shipping address" width="800">
  </el-dialog>
</template>

<style scoped>
.popup-content {
  /* 弹窗内容样式，可根据需要调整 */
  width: 200px;
  font-size: 14px;
}
</style>
