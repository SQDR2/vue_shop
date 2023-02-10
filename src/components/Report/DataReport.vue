<template>
  <div>
    <BreadCrumb FirstLevel="数据统计" SecondLevel="数据报表"></BreadCrumb>
    <el-card>
      <!--1.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px; height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import BreadCrumb from "../Common/BreadCrumb.vue";
import _ from 'lodash'
// 2.导入echarts
import * as echarts from "echarts";
import { onMounted } from "vue";
export default {
  data() {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  components: { BreadCrumb },
  async mounted() {
    // 3. 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById("main"));

    // 服务器请求的数据不完整（没有鼠标跟随的效果） 还要和option对象合并（使用lodash） 将合并的对象传给echarts展示
    const { data: res } = await this.$http.get("reports/type/1");
    if (res.meta.status !== 200) {
      return this.$message.error("获取折线图数据失败！");
    }
    // console.log(res.data)

    // 4. 准备数据和配置项
    const result = _.merge(res.data, this.options);

    // 5. 展示数据
    myChart.setOption(result);
  },
};
</script>

<style>
</style>