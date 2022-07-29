<template>
  <div>
    <BreadCrumb FirstLevel="订单管理" SecondLevel="订单列表"></BreadCrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderlist" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="order_number" label="订单编号"> </el-table-column>
        <el-table-column prop="order_price" label="订单价格"> </el-table-column>
        <el-table-column label="是否支付">
          <template v-slot="slotProps">
            <el-tag :type="slotProps.row.order_pay === '0' ? 'danger' : 'success'">{{ slotProps.row.order_pay === 1 ?
                '已付款'
                : '未付款'
            }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"> </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="slotProps">
            {{ $dayjs(slotProps.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="slotProps">
            <el-tooltip class="item" effect="dark" content="修改地址" placement="top">
              <el-button type="primary" icon="iconfont el-icon-edit" size="mini" @click="editAddress(slotProps.row)">
              </el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="物流状态" placement="top">
              <el-button type="success" icon="iconfont icon-wuliu" size="mini" @click="showWuliu"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[7, 11, 15, 20]" :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
    <!-- 修改地址 -->
    <el-dialog title="修改地址" :visible.sync="editVisible" width="50%" @close="editDialogClosed">
      <el-form :model="editForm" label-width="80px" :rules="editRules" ref="editFormRef">
        <el-form-item label="省市区县" prop="addressName">
          <el-cascader :options="cityOptions" v-model="editForm.addressName">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="detailAddress">
          <el-input v-model="editForm.detailAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流信息 -->
    <el-dialog title="物流进度" :visible.sync="wuliuVisible" width="50%">
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in wuliuArr" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import BreadCrumb from '../Common/BreadCrumb.vue'
import cityOptions from './city_data.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 7
      },
      total: 0,
      orderlist: [],
      editForm: {
        addressName: [],
        detailAddress: ''
      },
      editVisible: false,
      editRules: {
        addressName: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        detailAddress: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      },
      cityOptions: cityOptions,
      wuliuVisible: false,
      wuliuArr: []
    }
  },
  created () {
    this.getOrderList()
  },
  components: { BreadCrumb },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取订单列表失败！')
        return false
      }
      this.total = res.data.total
      this.orderlist = res.data.goods
      console.log(res)
    },
    // 列表条数切换
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 列表页码切换
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 修改地址
    editAddress (prop) {
      this.editVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
      this.editForm.addressName = []
      this.editForm.detailAddress = ''
    },
    async showWuliu () {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        this.$message.error('获取物流信息失败')
        return ''
      }
      this.wuliuArr = res.data
      console.log(this.wuliuArr)
      this.wuliuVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>