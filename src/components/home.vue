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
        <el-menu default-active="2" class="el-menu-vertical-demo" unique-opened>
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="1-1">
              <i class="el-icon-location"></i>
              用户列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-location"></i>
              角色列表
            </el-menu-item>
            <el-menu-item index="2-1">
              <i class="el-icon-location"></i>
              权限列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>
            <el-menu-item index="3-1">
              <i class="el-icon-location"></i>
              商品列表
            </el-menu-item>
            <el-menu-item index="3-2">
              <i class="el-icon-location"></i>
              分类参数
            </el-menu-item>
            <el-menu-item index="3-3">
              <i class="el-icon-location"></i>
              商品分类
            </el-menu-item>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>
            <el-menu-item index="4-1">
              <i class="el-icon-location"></i>
              订单列表
            </el-menu-item>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-location"></i>
              数据报表
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 验证登录状态
  beforeCreate() {
    if (!localStorage.getItem('token')) {
      this.$router.push({
        path: 'login'
      })
    }
  },
  // 退出登录
  methods: {
    logout() {
      localStorage.clear();
      this.$router.push({
        path: 'login'
      });
      this.$message({
        message: '退出成功',
        type: 'success'
      })
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
