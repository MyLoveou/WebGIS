<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="common-layout">
    <el-container>
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
            <el-sub-menu index="3">
              <template #title>
                <el-icon>
                  <location />
                </el-icon>
                <span>旅游打卡系统</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="3-1" :route="{ name: 'Main' }">首页</el-menu-item>
                <el-menu-item index="3-2" :route="{ name: 'User' }">用户</el-menu-item>
                <el-menu-item index="3-3" :route="{ name: 'Favorites' }">收藏夹</el-menu-item>
                <el-menu-item index="3-4" :route="{ name: 'Track' }">足迹</el-menu-item>
                <el-menu-item index="3-5" :route="{ name: 'Doc' }">文章</el-menu-item>
                <el-menu-item index="3-6" :route="{ name: 'World' }">世界</el-menu-item>
              </el-menu-item-group>
            </el-sub-menu>
          </el-menu>
        </el-aside>
      <el-container>
        <el-header>Header</el-header>
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
