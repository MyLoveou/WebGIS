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
        <el-aside width="200px">
          <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
            <el-menu-item index="4">
              <el-icon>
                <setting />
              </el-icon>
              <span>多源数据汇聚</span>
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
  height: 663px;
}

.el-container {

  height: 100%;
}

.el-aside {
  height: 100%; // 确保侧边栏高度为父容器高度
}
</style>
