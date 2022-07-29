<template>
  <div>
    <!-- 商品分类面包屑 -->
    <BreadCrumb FirstLevel="商品管理" SecondLevel="商品分类"></BreadCrumb>
    <!-- 表格卡片区 -->
    <el-card>
      <el-button type="primary" @click="AddClassification">添加分类</el-button>
      <!-- 表格区 -->
      <zk-table class="zktable" :data="Categorylist" :columns="columns" :selection-type="false" :expand-type="false"
        show-index index-text="#" border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="slotProps">
          <i v-if="!slotProps.row.cat_deleted" class="el-icon-success" style="color:lightgreen"></i>
          <i v-if="slotProps.row.cat_deleted" class="el-icon-error" style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="slotProps">
          <el-tag v-if="slotProps.row.cat_level == 0" size="mini">一级</el-tag>
          <el-tag v-else-if="slotProps.row.cat_level == 1" type="success" size="mini">二级</el-tag>
          <el-tag v-else-if="slotProps.row.cat_level == 2" type="warning" size="mini">三级</el-tag>
        </template>
        <!-- 操作区域 -->
        <template slot="opt" slot-scope="slotProps">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCate(slotProps.row.cat_id)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCate(slotProps.row.cat_id)">删除
          </el-button>
        </template>
      </zk-table>
      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[5, 7, 9, 11]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加分类" :visible.sync="AddVisible" width="40%" @close="removeForm">
      <el-form :model="addForm" ref="addClassification" :rules="Rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectKey" :options="parentCateList" :props="cascaderProps" clearable checkStrictly
            @change="handleChange">
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog title="编辑分类" :visible.sync="EditVisible" width="40%">
      <el-form :model="EditForm" ref="editClassification" :rules="Rules" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="EditForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditCategory">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      Categorylist: [],
      total: 0,
      // 控制表格列
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        }, {
          label: '编辑',
          type: 'template',
          template: 'opt'
        }
      ],
      // 添加分类对话框
      AddVisible: false,
      // 编辑分类对话款
      EditVisible: false,
      // 添加分类表单
      addForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 修改分类表单
      EditForm: {
        cat_id: 0,
        cat_name: ''
      },
      // 编辑、添加分类表单规则
      Rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ]
      },
      // 父级分类数组
      parentCateList: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 被级联选择器选中的id
      selectKey: []
    }
  },
  created () {
    // 调用获取商品分类列表
    this.getGoodCateList()
  },
  components: { BreadCrumb },
  methods: {
    // 获取商品分类数据列表
    async getGoodCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取商品分类数据列表失败') }
      this.Categorylist = res.data.result
      this.total = res.data.total
      console.log(res);
    },
    // 切换每页多少条
    handleSizeChange (newsize) {
      this.queryInfo.pagesize = newsize
      this.getGoodCateList()
    },
    // 切换页
    handleCurrentChange (newpage) {
      this.queryInfo.pagenum = newpage
      this.getGoodCateList()
    },
    // 添加分类
    AddClassification () {
      this.getParentCateList()
      this.AddVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类失败！')
      }
      this.parentCateList = res.data
    },
    //  选择项发生改变时触发
    handleChange () {
      let len = this.selectKey.length
      if (len > 0) {
        this.addForm.cat_pid = this.selectKey[len - 1]
        this.addForm.cat_level = len
        return false
      } else {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      }
    },
    // 确定添加类别按钮触发事件
    AddCategory () {
      this.$refs.addClassification.validate(async valid => {
        if (!valid) { return false }
        const { data: res } = await this.$http.post('categories', this.addForm)
        if (res.status != 201) {
          this.$message.error('添加类别失败')
        }
        this.AddVisible = false
        this.selectKey = []
        this.addForm.cat_level = 0
        this.addForm.cat_pid = 0
        this.getGoodCateList()
        this.$message.success('添加类别成功')
      })
    },
    // 关闭对话框时清空form表单数据
    removeForm () {
      this.$refs.addClassification.resetFields()
      this.selectKey = []
      this.addForm.cat_pid = 0
      this.addForm.cat_level = 0
    },
    // 删除类别触发事件
    deleteCate (id) {
      this.$confirm('此操作将永久删除该类别, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('categories/' + id)
        if (res.meta.status !== 200) {
          console.log('执行了')
          this.$message.error('删除类别失败')
          return false
        }
        this.getGoodCateList()
        this.$message.success('删除类别成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },
    // 打开编辑分类对话框
    async editCate (id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('获取当前分类信息失败！')
      }
      this.EditForm.cat_name = res.data.cat_name
      this.EditForm.cat_id = res.data.cat_id
      this.EditVisible = true
    },
    // 确定编辑分类
    async EditCategory () {
      const { data: res } = await this.$http.put('categories/' + this.EditForm.cat_id, { cat_name: this.EditForm.cat_name })
      if (res.meta.status !== 200) {
        this.$message.error('修改当前分类失败！')
      }
      this.$message.success('修改当前分类成功！')
      this.getGoodCateList()
      this.EditVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.zktable {
  margin-top: 10px;
}
</style>