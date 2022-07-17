<template>
  <div>
    <!-- 面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片栏 -->
    <el-card class="box-card">
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
            @clear="getUserlist">
            <el-button slot="append" icon="el-icon-search" @click="searchInfo"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="AddDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格栏 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <template v-slot="slotProps">
            <el-switch v-model="slotProps.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"
              @change="changeUserState(slotProps.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200px">
          <template v-slot="slotProps">
            <el-tooltip class="item" effect="dark" content="修改角色" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editDialog(slotProps.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除角色" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(slotProps.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[6, 10, 12, 14]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="AddDialogVisible" width="40%" @close="DialogClose('close')">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="addForm">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input type="email" v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="AddDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="AddUsers">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改用户对话框 -->
      <el-dialog title="修改用户信息" :visible.sync="editDialogVisible" width="40%" @close="DialogClose('edit')">
        <el-form :model="editForm" :rules="addFormRules" ref="addFormRef" label-width="80px" class="addForm">
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
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="EditUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    const checKEmail = (rule, value, callback) => {
      const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(?:(?:\+|00)86)?1\d{10}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 6
      },
      userlist: [],
      total: 0,
      AddDialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 10, message: '用户名长度在2-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '密码长度在6-12个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用邮箱', trigger: 'blur' },
          { validator: checKEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editDialogVisible: false,
      editForm: {}
    }
  },
  created () {
    this.getUserlist()
  },
  methods: {
    async getUserlist () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 改变pagesize的值
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserlist()
    },
    // 上下页
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserlist()
    },
    // 改变用户状态
    async changeUserState (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },
    searchInfo () {
      this.getUserlist()
    },
    // 添加用户弹窗关闭触发事件
    DialogClose (flag) {
      if (flag === 'close') {
        this.$refs.addFormRef.resetFields()
      } else if (flag === 'edit') {
        this.$refs.addFormRef.resetFields()
      }
    },
    // 添加用户验证
    AddUsers () {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) { return false }
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) { return this.$message.error('添加用户失败') }
        this.$message.success('添加用户成功')
        // 关闭添加用户对话框
        this.AddDialogVisible = false
        // 重新获取用户列表
        this.getUserlist()
      })
    },
    // 打开修改用户对话框
    async editDialog (id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) { return this.$message.error('获取用户信息失败') }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 修改用户信息
    EditUserInfo () {
      this.$refs.addFormRef.validate(async vaild => {
        if (!vaild) { return false }
        const { data: res } = await this.$http.put('users/' + this.editForm.id, { email: this.editForm.email, mobile: this.editForm.mobile })
        if (res.meta.status !== 200) { return this.$message.error('修改用户信息失败') }
        // 关闭添加用户对话框
        this.editDialogVisible = false
        // 重新获取用户列表
        this.getUserlist()
        this.$message.success('修改用户信息成功')
      })
    },
    deleteUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('users/' + id)
        if (res.meta.status !== 200) { return this.$message.error('删除操作失败!') }
        // 重新获取用户列表
        this.getUserlist()
        this.$message.success('删除操作成功!')
      }).catch((error) => {
        console.log(error)
        this.$message.info('取消删除操作!')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin: 0 5px 0 5px;
}

.addForm {
  padding-right: 20px;
}
</style>
