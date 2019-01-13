<template>
  <el-card class="card">
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <div id="main" style="width: 1100px;height: 600px;margin-top: 20px"></div>
  </el-card>
</template>

<script>
import echarts from "echarts";
export default {
  mounted() {
    this.creatReports();
  },
  methods: {
    async creatReports() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById("main"));

      // 请求表格数据
      const res = await this.$http.get(`reports/type/1`);
      console.log(res);
      const option1 = res.data.data

      // 指定图表的配置项和数据
      const option2 = {
        title: {
          text: ""
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        }
      };

      const option = {...option1, ...option2}

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  }
};
</script>

<style>
.card {
  height: 100%;
}
</style>
