<template>
  <div>
    <!-- 面包屑导航栏 -->
    <BreadCrumb FirstLevel="权限管理" SecondLevel="角色列表"></BreadCrumb>
    <el-card>
      <el-button type="primary" @click="AddDialogVisible = true">添加角色</el-button>
      <el-table :data="Rolelist" style="width: 100%" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="slotProps">
            <!-- 展开后整个一二三级权限表格 -->
            <el-row v-for="(item, index) in slotProps.row.children" :key="item.id"
              :class="['underline', index === 0 ? 'topline' : '', 'vcenter']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeLevel(slotProps.row, item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二三级权限 -->
              <el-col :span="19">
                <el-row v-for="(i, index) in item.children" :key="i.id" :class="[index === 0 ? '' : 'topline']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeLevel(slotProps.row, i.id)">{{ i.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="i2 in i.children" :key="i2.id" closable
                      @close="removeLevel(slotProps.row, i2.id)">
                      {{ i2.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="slotProps">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="OpeneditRole(slotProps.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(slotProps.row.id)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="AssignPermissions(slotProps.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="PermissionsDialogVisible" width="30%" @close="PermissionsDialogClosed">
      <!-- 树形结构 ---- 分配权限 -->
      <el-tree :data="AllPermissions" :props="treeProps" ref="treeRef" show-checkbox node-key="id" default-expand-all
        :default-checked-keys="defCK"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="PermissionsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="Distribution">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog title="编辑角色" :visible.sync="EditRoleDialogVisible" width="30%">
      <el-form :model="EditRoleForm" :rules="editRoleRules" ref="editFormRef" label-width="80px" class="editForm">
        <el-form-item label="角色ID">
          <el-input v-model="EditRoleForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="EditRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="EditRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditRole(EditRoleForm.roleId)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="AddDialogVisible" width="40%" @close="DialogClose">
      <el-form :model="roleForm" :rules="addRoleFormRules" ref="addFormRef" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      Rolelist: [],
      PermissionsDialogVisible: false,
      EditRoleDialogVisible: false,
      AddDialogVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      EditRoleForm: {
        roleId: '',
        roleName: '',
        roleDesc: ''
      },
      editRoleRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      addRoleFormRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [{ required: true, message: '请输入角色描述', trigger: 'blur' }]
      },
      // 分配权限属性结构
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 所有权限
      AllPermissions: [],
      // 默认选中的三级权限
      defCK: [],
      // 保存选中角色的id
      roleID: ''
    }
  },
  created () {
    this.getRolelist()
  },
  methods: {
    // 获取权限列表
    async getRolelist () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.Rolelist = res.data
    },
    // 打开修改权限对话框
    async OpeneditRole (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) { return this.$message.info('获取角色信息失败!') }
      this.EditRoleForm = res.data
      this.EditRoleDialogVisible = true
    },
    // 确定修改角色
    async EditRole (id) {
      const { data: res } = await this.$http.put('roles/' + id, { roleName: this.EditRoleForm.roleName, roleDesc: this.EditRoleForm.roleDesc })
      if (res.meta.status !== 200) { return this.$message.info('修改角色信息失败') }
      this.EditRoleDialogVisible = false
      this.getRolelist()
      this.$message.success('修改角色信息成功')
    },
    // 移除权限
    async removeLevel (role, id) {
      this.$confirm('此操作将永久删除该角色权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${id}`)
        if (res.meta.status !== 200) { return this.$message.error('删除操作失败!') }
        // 重新获取用户列表
        this.$message.success('删除操作成功!')
        // 防止每次删除权限需要重新给rolelist赋值时，展开窗口会关闭
        role.children = res.data
      }).catch((error) => {
        console.log(error)
        this.$message.info('取消删除操作!')
      })
    },
    // 分配权限
    AssignPermissions (role) {
      // 保存当前点击分配权限的角色id
      this.roleID = role.id
      // 获取全部权限
      this.getAllPermissions()
      // 获取已存在的三级权限
      this.getLedKeys(role, this.defCK)
      // 打开对话框
      this.PermissionsDialogVisible = true
    },
    // 添加角色
    async addRole () {
      const { data: res } = await this.$http.post('roles', this.roleForm)
      if (res.meta.status !== 201) { return this.$message.info('添加角色失败!') }
      this.getRolelist()
      this.$message.success('添加成功')
      this.AddDialogVisible = false
    },
    DialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 删除角色
    deleteRole (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('roles/' + id)
        if (res.meta.status !== 200) { return this.$message.error('删除操作失败!') }
        // 重新获取用户列表
        this.getRolelist()
        this.$message.success('删除操作成功!')
      }).catch((error) => {
        console.log(error)
        this.$message.info('取消删除操作!')
      })
    },
    // 所有权限--树形结构
    async getAllPermissions () {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) { return this.$message.info('获取所有权限失败！暂时无法分配权限！') }
      this.AllPermissions = res.data
    },
    // 获取已有的三级权限，赋值给defCK数组，从而给树形结构添加上默认选项
    getLedKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLedKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭
    PermissionsDialogClosed () {
      this.defCK = []
    },
    // 确定分配权限
    async Distribution () {
      // 将选中的结点和半选中的结点的id存到数组中
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // 将数组拼接成带,的字符串
      const idSr = keys.join(',')
      // 发送请求
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: idSr })
      if (res.meta.status !== 200) { return this.$message.info('更新失败！') }
      this.$message.success('更新成功!')
      this.getRolelist()
      this.PermissionsDialogVisible = false
    }
  },
  components: { BreadCrumb }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 10px 10px 40px;
}

.underline {
  border-bottom: 1px solid #eee;
}

.topline {
  border-top: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>