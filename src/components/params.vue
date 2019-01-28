<template>
  <el-card class="card">
    <!-- 面包屑 -->
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <!-- 消息框 -->
    <el-alert show-icon :closable="false" title="只允许为第三级分类设置参数" type="warning" class="alert"></el-alert>
    <!-- 级联选择器 -->
    <el-form :v-model="form">
      <el-form-item label="请选择商品分类">
        <el-cascader
          :options="options"
          v-model="type"
          :props="props"
          clearable
          :show-all-levels="false"
          @change="handleChange"
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tab栏 -->
    <el-tabs v-model="active" type="border-card" @tab-click="handleClick" style="height: 450px">
      <el-tab-pane label="动态参数" name="1">
        <el-button type="primary" :disabled="type.length === 0">设置动态参数</el-button>
        <el-table :data="pra" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- 可动态编辑的标签 -->
              <el-tag
                :key="i"
                v-for="(item, i) in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row, item)"
              >{{item}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <el-button type="primary" :disabled="type.length === 0">设置静态参数</el-button>
        <el-table :data="praStatic" style="width: 100%" height="400px">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="attr_name" label="属性名称" width="300"></el-table-column>
          <el-table-column prop="attr_vals" label="属性值" width="300"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getTypes()
  },
  data () {
    return {
      form: {},
      options: [],
      type: [1, 3, 6],
      props: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      active: '1',
      pra: [],
      praStatic: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  methods: {
    // 获取级联选择器数据
    async getTypes () {
      const res = await this.$http.get(`categories`)
      this.options = res.data.data
    },
    // tab栏被点击时触发
    handleClick () {
      this.getPra()
    },
    // 级联选择器改变时触发
    handleChange () {
      this.getPra()
    },
    // 获取参数
    async getPra () {
      // 动态
      if (this.active === '1' && this.type.length === 3) {
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
      }
      // 静态
      if (this.active === '2' && this.type.length === 3) {
        const res = await this.$http.get(
          `categories/${this.type[2]}/attributes?sel=only`
        )
        this.praStatic = res.data.data
        console.log(this.praStatic)
      }
    },
    async handleClose (attr, tag) {
      attr.attr_vals.splice(attr.attr_vals.indexOf(tag), 1)
      const putData = {
        attr_name: attr.attr_name,
        attr_sel: attr.attr_sel,
        attr_vals: attr.attr_vals.join(',')
      }
      const res = await this.$http.put(
        `categories/${this.type[2]}/attributes/${attr.attr_id}`,
        putData
      )
      console.log(res)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (attr) {
      let inputValue = this.inputValue
      if (inputValue) {
        attr.attr_vals.push(inputValue)
        const putData = {
          attr_name: attr.attr_name,
          attr_sel: attr.attr_sel,
          attr_vals: attr.attr_vals.join(',')
        }
        const res = await this.$http.put(
          `categories/${this.type[2]}/attributes/${attr.attr_id}`,
          putData
        )
        console.log(res)
      }
      this.inputVisible = false
      this.inputValue = ''
      console.log(attr.attr_vals)
    }
  }
}
</script>

<style scoped>
.card {
  height: 100%;
}
.alert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
