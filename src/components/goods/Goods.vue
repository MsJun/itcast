<template>
  <div>
          <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
      <router-view></router-view>
  </div>
</template>
<script>
    
</script>
<style scoped>
.el-breadcrumb{
    background-color: #D3DCE6;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
}
  .el-pagination {
    background-color: #D3DCE6;
    padding-top: 10px;
    height: 35px;
    line-height: 35px;
  }
</style>

