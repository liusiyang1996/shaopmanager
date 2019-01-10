<template>
  <el-container class="container">
    <el-header class="header" style="padding:0">
      <el-row>
        <el-col :span="4">
          <img src="@/assets/logo.png">
        </el-col>
        <el-col :span="19" class="middle">
          <h2>电商管理系统</h2>
        </el-col>
        <el-col :span="1">
          <a href="#" class="logout" @click.prevent="logout()">退出</a>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened router>
          <el-submenu :index="v1.order + ''" v-for="(v1, i) in menus" :key="i">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{v1.authName}}</span>
            </template>
            <el-menu-item :index="v2.path" v-for="(v2, i) in v1.children" :key="i">
              <i class="el-icon-location"></i>
              {{v2.authName}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 验证登录状态
  beforeCreate () {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        path: 'login'
      })
    }
  },
  created () {
    this.setMenu()
  },
  data () {
    return {
      menus: ''
    }
  },
  methods: {
    // 退出登录
    logout () {
      localStorage.clear()
      this.$router.push({
        path: 'login'
      })
      this.$message({
        message: '退出成功',
        type: 'success'
      })
    },
    // 动态渲染侧边栏
    async setMenu () {
      const res = await this.$http.get(`menus`)
      this.menus = res.data.data
      console.log(this.menus)
    }
  }
}
</script>

<style>
.container {
  height: 100%;
}
.header {
  background-color: #cccccc;
}
.middle {
  text-align: center;
  line-height: 60px;
}
.logout {
  line-height: 60px;
}
</style>
