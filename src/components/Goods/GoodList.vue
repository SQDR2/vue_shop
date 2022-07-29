<template>
  <div>
    <!-- 商品列表面包屑 -->
    <BreadCrumb FirstLevel="商品管理" SecondLevel="商品列表"></BreadCrumb>
    <!-- 卡片栏 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable
            @clear="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格栏 -->
      <el-table :data="goodslist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="680px"> </el-table-column>
        <el-table-column prop="goods_price" label="价格"> </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量"> </el-table-column>
        <el-table-column label="创建时间" width="180px">
          <template v-slot="slotProps">
            {{ $dayjs(slotProps.row.add_time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="200px">
          <template v-slot="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editGood(slotProps.row.goods_id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGood(slotProps.row.goods_id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[7, 11, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      total: 0,
      goodslist: []
    }
  },
  components: { BreadCrumb },
  created () {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败！')
        return false
      }
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    // 列表条数切换
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 列表页码切换
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 删除商品
    deleteGood (id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete('goods/' + id)
        if (res.meta.status !== 200) {
          this.$message.error('删除商品失败')
          return false
        }
        this.getGoodsList()
        this.$message.success('删除商品成功')
      }).catch(() => {
        this.$message.info('已取消删除')
      });
    },
    addGoods () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>