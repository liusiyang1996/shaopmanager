<template>
  <div class="box">
    <el-form label-position="top" label-width="80px" :model="formdata" class="form">
      <h2>用户登录</h2>
      <el-form-item label="用户名">
        <el-input v-model="formdata.username"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="formdata.password"></el-input>
      </el-form-item>
      <el-button type="primary" class="btn" @click="login()">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    // async和await 使用类似同步的方法来获取异步操作的结果
    async login () {
      const res = await this.$http.post('login', this.formdata)
      const {data: {data, meta: {msg, status}}} = res
      if (status === 200) {
        // 登陆成功时保存用户数据中的token值
        localStorage.setItem('token', data.token)
        // 跳转路由
        this.$router.push({
          path: '/'
        })
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style>
.box {
  background-color: aquamarine;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
}
.form {
  width: 400px;
  background-color: #ffffff;
  padding: 0 30px 30px 30px;
  border-radius: 10px;
}
.form .btn {
  width: 100%;
}
</style>
