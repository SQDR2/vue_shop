<template>
  <!-- 通用面包屑 -->
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>{{ FirstLevel }}</el-breadcrumb-item>
    <el-breadcrumb-item>{{ SecondLevel }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: 'BreadCrumb',
  props: ['FirstLevel', 'SecondLevel']
}
</script>
