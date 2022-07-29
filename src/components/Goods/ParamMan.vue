<template>
  <div>
    <!-- 商品列表面包屑 -->
    <BreadCrumb FirstLevel="商品管理" SecondLevel="分类参数"></BreadCrumb>
    <!-- 卡片区 -->
    <el-card>
      <!-- 警示栏 -->
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row>
        <el-col class="casc_opts">
          <span>请选择商品分类：</span>
          <el-cascader v-model="selectKey" :options="CateParamList" :props="cascaderProps" clearable
            @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="selectKey.length === 3 ? false : true"
            @click="addVisible = true">添加参数</el-button>
          <el-table :data="ListParameters" border style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="slotProps">
                <el-tag closable v-for="(item, i) in slotProps.row.attr_vals" :key="i"
                  @close="handleClose(i, slotProps.row)">{{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="slotProps.row.inputVisible" v-model="slotProps.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="slotProps">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParmaPropDialog(slotProps.row)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParamProp(slotProps.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="selectKey.length === 3 ? false : true"
            @click="addVisible = true">添加属性</el-button>
          <el-table :data="PropertyList" border style="width: 100%">
            <el-table-column type="expand">
              <template v-slot="slotProps">
                <el-tag closable v-for="(item, i) in slotProps.row.attr_vals" :key="i"
                  @close="handleClose(i, slotProps.row)">{{ item }}</el-tag>
                <el-input class="input-new-tag" v-if="slotProps.row.inputVisible" v-model="slotProps.row.inputValue"
                  ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(slotProps.row)"
                  @blur="handleInputConfirm(slotProps.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(slotProps.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="slotProps">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="editParmaPropDialog(slotProps.row)">编辑
                </el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParamProp(slotProps.row)">删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
      <!-- 添加参数/属性对话框 -->
      <el-dialog :title="this.activeName === 'only' ? '添加静态属性' : '添加动态参数'" :visible.sync="addVisible" width="40%"
        @close="DialogClosed('add')">
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
          <el-form-item :label="this.activeName === 'only' ? '静态属性' : '动态参数'" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addVisible = false">取 消</el-button>
          <el-button type="primary" @click="addParamProp">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改参数/属性对话框 -->
      <el-dialog :title="this.activeName === 'only' ? '修改静态属性' : '修改动态参数'" :visible.sync="editVisible" width="40%"
        @close="DialogClosed('edit')">
        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="80px">
          <el-form-item :label="this.activeName === 'only' ? '静态属性' : '动态参数'" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editVisible = false">取 消</el-button>
          <el-button type="primary" @click="editParamProp">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      // 商品分类数据列表
      CateParamList: [],
      // 级联选择数组
      selectKey: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      activeName: 'many',
      // 参数列表
      ListParameters: [],
      // 属性列表
      PropertyList: [],
      // 添加参数/属性
      addForm: {
        attr_name: ''
      },
      editForm: {
        attr_name: '',
        attr_id: '',
        cat_id: ''
      },
      // 控制对话框
      addVisible: false,
      editVisible: false,
      // 添加参数/属性input框的规则
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '名称长度在1-10个字符之间', trigger: 'blur' }
        ]
      },
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 10, message: '名称长度在1-10个字符之间', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateParamList()
  },
  components: { BreadCrumb },
  methods: {
    async getCateParamList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败！')
        return ''
      }
      this.CateParamList = res.data
    },
    // 级联选择被触发
    handleChange () {
      if (this.selectKey.length < 3) {
        this.selectKey = []
        this.ListParameters = []
        this.PropertyList = []
        return ''
      }
      this.getParamList()
    },
    handleClick () {
      if (this.selectKey.length !== 3) {
        this.$message.info('请先选择商品的分类')
      } else if (this.selectKey.length === 3) {
        this.getParamList()
      }
    },
    // 获取参数列表
    async getParamList () {
      const { data: res } = await this.$http.get(`categories/${this.selectKey[2]}/attributes`, { params: { sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('获取当前分类参数列表失败！')
        return false
      }
      res.data.forEach(item => {
        item.inputVisible = false
        item.inputValue = ''
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : []
      })
      if (this.activeName === 'many') {
        this.ListParameters = res.data
      } else if (this.activeName === 'only') {
        this.PropertyList = res.data
      }
    },
    // 监听对话框关闭事件
    DialogClosed (flag) {
      if (flag === 'edit') {
        this.$refs.editFormRef.resetFields()
      } else if (flag === 'add') {
        this.$refs.addFormRef.resetFields()
      }
    },
    // 确定添加参数/属性
    addParamProp () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) { return '' }
        const { data: res } = await this.$http.post(`categories/${this.selectKey[2]}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败！')
          return false
        }
        this.$message.success('添加参数成功！')
        this.addVisible = false
        this.getParamList()
      })
    },
    // 打开修改动态参数/静态属性对话框 获取的信息
    async editParmaPropDialog (prop) {
      this.editVisible = true
      const { data: res } = await this.$http.get(`categories/${prop.cat_id}/attributes/${prop.attr_id}`, { params: { attr_sel: this.activeName } })
      if (res.meta.status !== 200) {
        this.$message.error('获取当前当前信息失败！')
        return false
      }
      this.editForm.attr_name = res.data.attr_name
      this.editForm.cat_id = res.data.cat_id
      this.editForm.attr_id = res.data.attr_id
    },
    // 确定修改参数属性
    editParamProp () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) { return '' }
        const { data: res } = await this.$http.put(`categories/${this.editForm.cat_id}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        if (res.meta.status !== 200) {
          this.$message.error('更新失败！')
          return false
        }
        this.editVisible = false
        this.getParamList()
      })
    },
    // 删除参数属性
    deleteParamProp (prop) {
      this.$confirm('此操作将永久删除该参数/属性, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`categories/${prop.cat_id}/attributes/${prop.attr_id}`)
        if (res.meta.status !== 200) {
          this.$message.error('删除操作失败!')
          return false
        }
        // 重新获取用户列表
        this.getParamList()
        this.$message.success('删除操作成功!')
      }).catch((error) => {
        console.log(error)
        this.$message.info('取消删除操作!')
      })
    },
    // 文本框失去焦点或按下回车
    handleInputConfirm (prop) {
      if (prop.inputValue.trim().length === 0) {
        prop.inputValue = ''
        prop.inputVisible = false
        return ''
      }
      prop.attr_vals.push(prop.inputValue.trim())
      prop.inputValue = ''
      prop.inputVisible = false
      this.saveAttrvlas(prop)
    },
    // 保存标签到数据库
    async saveAttrvlas (prop) {
      const { data: res } = await
        this.$http.put(`categories/${this.selectKey[2]}/attributes/${prop.attr_id}`,
          { attr_name: prop.attr_name, attr_sel: prop.attr_sel, attr_vals: prop.attr_vals.join(',') })
      if (res.meta.status !== 200) {
        this.$message.error(res.meta.msg)
        return false
      }
      this.$message.success(res.meta.msg)
    },
    // 文本框和tag切换
    showInput (prop) {
      prop.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      })
    },
    // 标签删除
    handleClose (i, prop) {
      prop.attr_vals.splice(i, 1)
      this.saveAttrvlas(prop)
    }
  }
}
</script>

<style lang="less" scoped>
.casc_opts {
  margin-top: 20px;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 90px;
  margin: 10px;
  vertical-align: bottom;
}
</style>