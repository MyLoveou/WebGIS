<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        测试
      </el-header>
      <el-container class="aside-main">
        <el-aside width="160px">
          <el-menu :router="true" class="el-menu-vertical-demo">
            <el-menu-item index="1" :route="{ name: 'Map' }">
              <el-icon>
                <setting />
              </el-icon>
              <span>多源数据汇聚</span>
            </el-menu-item>
            <el-sub-menu index="2">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>地图制作</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="2-1" :route="{ name: 'HeatMap' }">热力图</el-menu-item>
                <el-menu-item index="2-2">等</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
            <el-menu-item index="3" :route="{ name: 'Basemap' }">
              <el-icon>
                <setting />
              </el-icon>
              <span>地图控件</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-main><router-view></router-view></el-main>
      </el-container>
    </el-container>
  </div>

</template>

<style lang="less" scoped>
.el-menu--horizontal>.el-menu-item:nth-child(1) {
  margin-right: auto;
}

.el-main {
  --el-main-padding: 0px !important;
  height: 100%;
}

.el-container {

  height: 100%;
}

.el-aside {
  height: 100%; // 确保侧边栏高度为父容器高度
}
</style>
