<template>
  <el-card class="box-card">
    <!-- 面包屑 -->
    <my-bread level1="权限管理" level2="角色列表"></my-bread>
    <!-- 按钮 -->
    <el-button type="success" plain class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table :data="roles" style="width: 100%" class="table" height="400px">
      <!-- 表格展开内容 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row v-for="(item1, i) in scope.row.children" :key="i">
            <el-col :span="4">
              <el-tag
                closable
                class="level"
                @close="deleteRights(scope.row, item1)"
              >{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
              <el-row v-for="(item2, i) in item1.children" :key="i">
                <el-col :span="4">
                  <el-tag
                    type="success"
                    closable
                    class="level"
                    @close="deleteRights(scope.row, item2)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    type="warning"
                    v-for="(item3, i) in item2.children"
                    :key="i"
                    closable
                    class="level"
                    @close="deleteRights(scope.row, item3)"
                  >{{item3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length === 0">
            <span>该角色未分配权限</span>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" width="180" type="index"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="240"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="260"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" @click="assignRights(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="50%">
      <!-- 树形结构 -->
      <el-tree :data="rights" show-checkbox node-key="id" default-expand-all :props="props" :default-checked-keys="arrChecked" ref="tree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRights()">确 定</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  created () {
    this.getRoles()
  },
  data () {
    return {
      // 存储所有角色以及所拥有的权限
      roles: [],
      dialogVisible: false,
      // 存储所有权限
      rights: [],
      props: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的id
      arrChecked: [],
      // 当前角色ID
      tempID: 0
    }
  },
  methods: {
    async getRoles () {
      const res = await this.$http.get(`roles`)
      this.roles = res.data.data
    },
    // 删除角色的权限
    async deleteRights (role, right) {
      // role角色  right权限
      const res = await this.$http.delete(
        `roles/${role.id}/rights/${right.id}`
      )
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
        // 只更新当前角色的权限
        role.children = res.data.data
      } else {
        this.$message({
          type: 'error',
          message: msg
        })
      }
    },
    // 分配权限对话框显示
    async assignRights (role) {
      // 设置当前角色ID
      this.tempID = role.id
      // 在对话框显示所有权限
      this.dialogVisible = true
      const res = await this.$http.get(`rights/tree`)
      this.rights = res.data.data

      // 获取当前点击用户的权限并默认选中
      const arr = []
      role.children.forEach((item1) => {
        // arr.push(item1.id)
        item1.children.forEach((item2) => {
          // arr.push(item2.id)
          item2.children.forEach((item3) => {
            arr.push(item3.id)
          })
        })
      })
      this.arrChecked = arr
    },
    // 设置角色权限
    async setRights () {
      // 获取当前角色树形结构的所有已选择的节点
      const arr1 = this.$refs.tree.getCheckedKeys()
      // 获取当前角色所有半选的节点
      const arr2 = this.$refs.tree.getHalfCheckedKeys()
      const arr = [...arr1, ...arr2]
      const res = await this.$http.post(`roles/${this.tempID}/rights`, {
        rids: arr.join(',')
      })
      if (res.data.meta.status === 200) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg
        })
      } else {
        this.$message({
          type: 'error',
          message: res.data.meta.msg
        })
      }
      this.dialogVisible = false
      this.getRoles()
    }
  }
}
</script>

<style scoped>
.box-card {
  height: 100%;
}
.btn {
  margin-top: 20px;
}
.level {
  margin-top: 10px;
}
</style>
