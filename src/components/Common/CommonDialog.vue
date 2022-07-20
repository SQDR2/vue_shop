<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="40%" @close="DialogClose">
    <el-form :model="Form" :rules="FormRules" ref="FormRef" label-width="80px" class="Form">
      <el-form-item label="用户名">
        <el-input :value="editForm.username" disabled></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input type="email" v-model="editForm.email"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="editForm.mobile"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      title: '',
      dialogVisible: false,
      Form: []
    }
  },
}
</script>

<style lang="less" scoped>
</style>