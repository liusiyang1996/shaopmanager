<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="商品列表"></my-bread>
    <!-- 消息框 -->
    <el-alert :closable="false" title="消息提示的文案" type="info" center show-icon class="alert"></el-alert>
    <!-- 步骤条 -->
    <el-steps :active="1 * active" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- tab栏 -->
    <el-form :model="form" label-width="80px" label-position="top" class="form">
      <el-tabs tab-position="left" v-model="active" class="tab" @tab-click="tabChange()">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader :options="options" v-model="type" :props="props" clearable></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <el-form-item :label="v1.attr_name" v-for="(v1, i) in pra" :key="i">
            <el-checkbox-group v-model="v1.attr_vals">
              <el-checkbox :label="v2" v-for="(v2, i) in v1.attr_vals" :key="i" border></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <el-form-item :label="v.attr_name" v-for="(v, i) in praStatic" :key="i">
            <el-input v-model="v.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item label="图片上传">
            <!-- action 图片上传路径 -->
            <!-- list-type 上传类型 -->
            <!-- headers 为上传请求添加的请求头 -->
            <el-upload
              class="upload-demo"
              action="http://localhost:8888/api/private/v1/upload"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :headers="headers"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <el-button type="primary" class="btn" @click="addGoods()">添加商品</el-button>
            <!-- 富文本 -->
            <quillEditor></quillEditor>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
</template>

<script>
// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  created () {
    this.getTypes()
  },
  data () {
    return {
      active: '1',
      form: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 分类
        goods_cat: '',
        // 详情
        goods_introduce: '',
        // 图片路径
        pics: [],
        // 参数
        attrs: []
      },
      // 级联选择器所依赖的数据
      options: [],
      // 级联选择器所选中的数据
      type: [1, 3, 6],
      // 级联选择器的配置项
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      // 当前动态参数的数据
      pra: [],
      // 当前静态参数的数据
      praStatic: [],
      // 图片上传的请求头
      headers: {
        Authorization: localStorage.getItem('token')
      }
    }
  },
  methods: {
    // 获取级联选择器所依赖的数据
    async getTypes () {
      const res = await this.$http.get(`categories`)
      this.options = res.data.data
    },
    // 当点击第二个tab时并且选择了级联选择器第三级，去请求动态参数
    async tabChange () {
      // 当点击第二个tab时并且选择了级联选择器第三级，去请求动态参数
      if (this.active === '2') {
        if (this.type.length === 3) {
          const res = await this.$http.get(
            `categories/${this.type[2]}/attributes?sel=many`
          )
          this.pra = res.data.data
          console.log(this.pra)
          // 将动态参数字符串转化为数组
          this.pra.forEach((item, i) => {
            item.attr_vals =
              item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
          })
        } else {
          this.$message({
            type: 'error',
            message: '请选择三级分类'
          })
        }
      }
      // 当点击第三个tab时并且选择了级联选择器第三级，去请求静态参数
      if (this.active === '3') {
        if (this.type.length === 3) {
          const res = await this.$http.get(
            `categories/${this.type[2]}/attributes?sel=only`
          )
          this.praStatic = res.data.data
          // console.log(this.praStatic)
        } else {
          this.$message({
            type: 'error',
            message: '请选择三级分类'
          })
        }
      }
    },
    // 图片上传时所触发的勾子函数
    handleRemove (file, fileList) {
      console.log('remove---')
      // console.log(file)
      // findIndex 可以循环数组， 第一个参数是函数，返回值是符合条件的索引
      const index = this.form.pics.findIndex((item) => {
        return item.pic === file.response.data.tmp_path
      })
      this.form.pics.splice(index, 1)
      // console.log(this.form.pics)
    },
    handleSuccess (response, file, fileList) {
      console.log('success---')
      // response.data.tmp_path是图片临时储存路径
      this.form.pics.push({
        pic: response.data.tmp_path
      })
      // console.log(this.form.pics)
    },
    // 添加商品
    async addGoods () {
      // 将商品分类处理成相应数据
      this.form.goods_cat = this.type.join(',')
      // 将商品参数处理成相应数据
      const arr1 = this.pra.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      const arr2 = this.praStatic.map((item) => {
        return {attr_id: item.attr_id, attr_value: item.attr_vals}
      })
      const arr = [...arr1, ...arr2]
      this.form.attrs = arr
      const res = await this.$http.post('goods', this.form)
      if (res.data.meta.status === 201) {
        this.$router.push({
          name: 'goodsList'
        })
      }
      this.$message({
        message: res.data.meta.msg,
        type: 'success'
      })
    }
  },
  components: {
    // 富文本组件
    quillEditor
  }
}
</script>

<style>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.tab {
  margin-top: 20px;
}
.form {
  overflow: auto;
  height: 400px;
}
.btn {
  margin-bottom: 20px;
}
.ql-editor{
  min-height: 200px;
}
</style>
