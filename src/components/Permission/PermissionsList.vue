<template>
  <div>
    <!-- 面包屑导航栏 -->
    <BreadCrumb FirstLevel="权限管理" SecondLevel="权限列表"></BreadCrumb>
    <!-- 权限列表区 -->
    <el-card>
      <el-table :data="Permissionslist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="等级(1>2>3)">
          <template v-slot="slotProps">
            <el-tag v-if="slotProps.row.level === '0'">一级权限</el-tag>
            <el-tag type="success" v-if="slotProps.row.level === '1'">二级权限</el-tag>
            <el-tag type="info" v-if="slotProps.row.level === '2'">三级权限</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      Permissionslist: []
    }
  },
  created () {
    this.getPermissionslist()
  },
  components: { BreadCrumb },
  methods: {
    async getPermissionslist () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限列表失败')
        return false
      }
      this.Permissionslist = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
</style>