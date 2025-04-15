<script setup>
import Map from '@/components/map.vue';
import { ref } from 'vue'

const map = ref(null)
</script>

<template>
  <Map v-model:map="map"></Map>
</template>

<style lang="less" scoped>

</style>