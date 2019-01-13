<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="query"
        class="input-with-select"
        clearable
        @clear="getListData()"
      >
        <el-button slot="append" icon="el-icon-search" @click="searchData()"></el-button>
      </el-input>
      <el-button type="primary" @click="addListShow()">添加用户</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" class="table" v-loading="loading">
      <el-table-column prop="id" label="#" width="100"></el-table-column>
      <el-table-column prop="username" label="姓名" width="140"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <el-table-column label="创建日期" width="120">
        <!-- 在单元格内展示非文本时（如插值表达式）需要给展示内容外层套上template标签 -->
        <!-- solt-scope是vue提供的一种写法，会自动绑定上一层的数据源(tableData)，
        在调用时row代表data数组中的每一项-->
        <template slot-scope="scope">{{scope.row.create_time | fmtDate}}</template>
      </el-table-column>
      <el-table-column label="用户状态" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            circle
            size="mini"
            @click="editListShow(scope.row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            size="mini"
            @click="deleteData(scope.row.id)"
          ></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" @click="checkUserShow(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- @size-change 每页显示条数改变时会触发 -->
    <!-- @current-change 当前页数改变时会触发 -->
    <!-- current-page 当前页 -->
    <!-- page-size 每页显示条数 -->
    <!-- page-sizes 每页显示条数的数组 -->
    <!-- layout 分页组件的功能 -->
    <!-- total 总页数 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加功能的对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑功能的对话框 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input v-model="form.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click="editData()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleCheck">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userRoleName" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-select v-model="userRoleId" placeholder="请选择">
            <el-option label="请选择" :value="-1"></el-option>
            <el-option v-for="(v, i) in roles" :key="i" :label="v.roleName" :value="v.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleCheck = false">取 消</el-button>
        <el-button type="primary" @click="checkUser()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      // 加载动画
      loading: true,
      // 用户信息数据
      tableData: [],
      // 搜索栏数据
      query: '',
      // 当前页数
      pagenum: 1,
      // 每页显示条数
      pagesize: 2,
      // 用户数据总数
      total: -1,
      // 添加/编辑表单数据
      form: {
        name: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 用户角色下拉框数据
      userRoleId: -1,
      // 用户角色当前用户名
      userRoleName: '',
      // 当前用户id
      userId: 0,
      // 所有用户角色信息
      roles: [],
      // 控制对话框显示
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleCheck: false,
      formLabelWidth: '100px'
    }
  },
  created () {
    this.getListData()
  },
  methods: {
    // 获取用户列表
    async getListData () {
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      // token失效重新登录
      if (res.data.meta.msg === '无效token') {
        this.$router.push({
          path: '/login'
        })
        this.$message({
          message: 'token已失效， 请重新登录',
          type: 'success'
        })
        return
      }
      const {
        data: {
          data: { total, users },
          meta: { msg, status }
        }
      } = res
      if (status === 200) {
        this.$message({
          message: msg,
          type: 'success'
        })
        this.tableData = users
        this.total = total
        this.loading = false
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
    },
    // 当前页改变
    handleSizeChange (val) {
      // val是改变后的值
      this.pagesize = val
      this.getListData()
    },
    // 每页显示条数改变
    handleCurrentChange (val) {
      this.pagenum = val
      this.getListData()
    },
    // 搜索功能
    searchData () {
      this.pagenum = 1
      this.getListData()
    },
    // 添加列表显示
    addListShow () {
      this.dialogFormVisibleAdd = true
      this.form.username = ''
      this.form.password = ''
      this.form.email = ''
      this.form.mobile = ''
    },
    // 添加用户
    async addData () {
      this.dialogFormVisibleAdd = false
      const res = await this.$http.post('users', this.form)
      const {
        data: {
          meta: { msg, status }
        }
      } = res
      if (status === 201) {
        this.$message({
          message: msg,
          type: 'success'
        })
      } else {
        this.$message({
          message: msg,
          type: 'error'
        })
      }
      this.getListData()
    },
    // 删除数据
    deleteData (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$http.delete(`users/${id}`)
          const {
            data: {
              meta: { msg, status }
            }
          } = res
          if (status === 200) {
            this.$message({
              type: 'success',
              message: msg
            })
          } else {
            this.$message({
              type: 'success',
              message: msg
            })
          }
          this.pagenum = 1
          this.getListData()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 编辑列表显示
    editListShow (userdata) {
      this.dialogFormVisibleEdit = true
      this.form = userdata
    },
    // 编辑数据
    async editData () {
      this.dialogFormVisibleEdit = false
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      const {
        data: {
          meta: { msg, status }
        }
      } = res
      if (status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
      } else {
        this.$message({
          type: 'success',
          message: msg
        })
      }
    },
    // 更改用户状态
    async changeState (userdata) {
      await this.$http.put(`users/${userdata.id}/state/${userdata.mg_state}`)
    },
    // 修改用户角色显示
    async checkUserShow (userdata) {
      this.dialogFormVisibleCheck = true
      // console.log(userdata)
      // 显示用户名
      this.userRoleName = userdata.username
      // 显示下拉列表项
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
      // 获取当前用户的角色信息
      const res2 = await this.$http.get(`users/${userdata.id}`)
      this.userRoleId = res2.data.data.rid
      this.userId = userdata.id
    },
    // 修改用户角色
    async checkUser () {
      const res = await this.$http.put(`users/${this.userId}/role`, {rid: this.userRoleId})
      const {data: {meta: {msg, status}}} = res
      if (status === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
      } else {
        this.$message({
          type: 'success',
          message: msg
        })
      }
      this.dialogFormVisibleCheck = false
    }
  }
}
</script>

<style>
.box-card {
  height: 100%;
}
.input-with-select {
  width: 350px;
}
.table {
  margin-top: 20px;
  margin-bottom: 30px;
}
</style>
