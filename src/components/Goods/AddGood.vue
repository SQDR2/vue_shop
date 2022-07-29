<template>
  <div>
    <!-- 商品列表面包屑 -->
    <BreadCrumb FirstLevel="商品管理" SecondLevel="添加商品"></BreadCrumb>
    <el-card>
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false">
      </el-alert>
      <el-steps :active="active * 1" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form :model="addForm" :rules="addFormRules" ref="addFormref" label-width="100px" label-position="top">
        <el-tabs v-model="active" tab-position="left" :before-leave="leaveTabsBefore" @tab-click="tabClick">
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="addForm.goods_cat" :options="Catelist" :props="cascaderProps" clearable
                @change="handleChange">
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manySeldata" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlySeldata" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action是上传到哪里 -->
            <el-upload :action="uploadURL" :on-preview="handlePreview" :on-remove="handleRemove" multiple :limit="3"
              :headers="headerObj" list-type="picture" :on-success="handleSuccess">
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- f富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="addgood" @click="addGood">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt="" class="preview">
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      active: 0,
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs:[]
      },
      addFormRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }]
      },
      Catelist: [],
      // 级联选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 参数数组
      manySeldata: [],
      // 属性数组
      onlySeldata: [],
      // 是否被选中
      checked: true,
      // 上传图片的路劲
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传时的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片路径
      previewPath: '',
      previewVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  components: { BreadCrumb },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类列表失败')
        return false
      }
      this.Catelist = res.data
    },
    handleChange () {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换便签页触发之前
    leaveTabsBefore (activename, oldactivename) {
      if (oldactivename === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类!')
        return false
      }
    },
    // 点击tabs切换
    async tabClick () {
      // 获取动态参数列表
      if (this.active === '1') {
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取动态参数列表失败！')
          return false
        }
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manySeldata = res.data
        console.log(this.manySeldata)
      } else if (this.active === '2') {
        // 获取静态属性列表
        const { data: res } = await this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          this.$message.error('获取静态属性列表失败！')
          return false
        }
        this.onlySeldata = res.data
      }
    },
    // 点击上传了文件时触发
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 移除已上传文件时的钩子
    handleRemove (file) {
      const filePath = file.response.data.tem_path
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功是触发
    handleSuccess (response) {
      const picInfo = { pic: response.data.tmp_path }
      pics.push(picInfo)
    },
    // 添加商品
    addGood () {
      this.$refs.addFormref.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        this.manySeldata.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,attr_value:item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        this.onlySeldata.forEach(item => {
          const newInfo = {
            attr_id:item.attr_id,attr_value:item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        const form = this.deepClone(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 发送添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          this.$message.error('添加商品失败！')
          return false
        }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
      })
    },
    // 对象深拷贝
    deepClone (obj) {
      let newObj = obj instanceof Array ? [] : {}
      for (let item in obj) {
        let template = obj[item] == 'object' ? deepClone(obj[item]) : obj[item]
        newObj[item] = template
      }
      return newObj
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin-top: 10px;
}

.el-checkbox {
  margin: 0 10px;
}

.preview {
  width: 100%;
}

.addgood {
  margin-top: 10px;
}
</style>