<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/rights'}">权限列表</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row class="add">
        <el-button type="primary"
                   @click="dialogAddVisible=true">添加角色</el-button>
      </el-row>
      <!-- 表格展示角色列表 -->
      <el-table :data="roleList"
                border
                stripe
                height="450px">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row :class="['bdbottom',index1===0?'bdtop':'','','vcenter']"
                    v-for="(item1,index1) in scope.row.children"
                    :key="item1.id">
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightByid(scope.row,item1.id)">
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row :class="['bdbottom',index2===0?'bdtop':'','vcenter']"
                        v-for="(item2,index2) in item1.children"
                        :key="item2.id">
                  <el-col :span="5">
                    <el-tag type="success"
                            closable
                            @close="removeRightByid(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag type="danger"
                            v-for="item3 in item2.children"
                            :key="item3.id"
                            closable
                            @close="removeRightByid(scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"
                         align="center"></el-table-column>
        <el-table-column label="角色名称"
                         prop="roleName"
                         width="350px">
        </el-table-column>
        <el-table-column label="角色描述"
                         prop="roleDesc"
                         width="350px">
        </el-table-column>
        <el-table-column label="权限管理">
          <template v-slot="scope">
            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="编辑"
                        placement="top-start">
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-edit"
                         @click="dialogEditOpen(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="删除"
                        placement="top-start">
              <el-button size="mini"
                         type="danger"
                         @click="roleDelete(scope.row)"
                         icon="el-icon-delete"></el-button>
            </el-tooltip>
            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="分配权限"
                        placement="top-start">
              <el-button size="mini"
                         type="warning"
                         @click="showSetRightDialog(scope.row)"
                         icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限的dialog对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="dialogBoxVisible"
               v-model="dialogBoxVisible"
               width="30%"
               @close="defaultKeys=[]">
      <!-- 树形空间 -->
      <el-tree :data="rightList"
               show-checkbox
               default-expand-all
               :default-checked-keys="defaultKeys"
               node-key="id"
               ref="treeRef"
               highlight-current
               :props="defaultProps">
      </el-tree>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogBoxVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="handleAddRights">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加角色的dialog对话框 -->
    <el-dialog title="添加角色"
               :visible.sync="dialogAddVisible"
               v-model="dialogAddVisible"
               @close="dialogAddClose"
               width="30%">
      <el-form :model="fromByaddRoleBy"
               :rules="roleRules"
               ref="ruleFormByAdd">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="fromByaddRoleBy.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="fromByaddRoleBy.roleDesc"
                    type="textarea"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAddClose">取 消</el-button>
          <el-button type="primary"
                     @click="handleAddRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 编辑角色的dialog对话框 -->
    <el-dialog title="编辑角色信息"
               :visible.sync="dialogEditVisible"
               v-model="dialogEditVisible"
               @close="dialogEditClose"
               width="30%">
      <el-form :model="fromByaddRoleBy"
               :rules="roleRules"
               ref="ruleFormByEdit">
        <el-form-item label="角色名称"
                      prop="roleName">
          <el-input v-model="fromByaddRoleBy.roleName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="fromByaddRoleBy.roleDesc"
                    type="textarea"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogEditClose">取 消</el-button>
          <el-button type="primary"
                     @click="handleEditRole">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {

  data () {
    return {
      // 角色列表数据
      roleList: [],
      // 权限列表
      rightList: [],
      // dialog对话框是否出现的属性 
      dialogBoxVisible: false,
      // 添加角色的dialog对话框是否出现的属性
      dialogAddVisible: false,
      // 编辑角色的dialog对话框是否出现的属性
      dialogEditVisible: false,
      // 树形结构展示的默认属性
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 树形结构默认被选中的key数组
      defaultKeys: [],
      // 每一次操作的角色id
      roleID: null,
      // 添加用户的表单数据
      fromByaddRoleBy: {
        roleName: '',
        roleDesc: ''
      },
      // 角色表单认证
      roleRules: {
        roleName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  // 实例创建完之后立即调用的钩子函数
  created () {
    // 调用获取角色列表的函数
    this.getRoleList();
  },
  methods: {
    // 【获取角色列表】事件处理函数
    async getRoleList () {
      // 向服务器发起请求，并使用解构获取服务器响应的数据
      const { data: res } = await this.$http.get("roles");
      // 如果服务器响应的状态码不为200，则获取失败
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败：" + res.meta.msg);
      // 成功后赋值给roleList属性
      this.roleList = res.data;
    },
    // 【根据ID移除对应角色的权限】事件处理函数,并接收角色和权限俩个参数
    async removeRightByid (role, rightsID) {
      // 调用提示对话框，并获取点击的结果
      const confirmResult = await this.$confirm("此操作将移除该角色所有用户的该权限，是否继续？", "提示", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 如果是取消,则结束，并提示用户
      if (confirmResult !== "confirm") return this.$message.info("已取消操作！");
      // 否则就是移除权限,那么就像服务器发起请求，并获取服务器响应的结果
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsID}`);
      // 如果服务器响应的状态码不为200，则移除失败
      if (res.meta.status !== 200) return this.$message.error("移除权限失败：" + res.meta.msg);
      // 移除成功后，更新这一行数据的子节点
      role.children = res.data;
      // 并提示成功
      this.$message.success(res.meta.msg);
    },
    // 【权限对话框打开】事件处理函数
    async showSetRightDialog (role) {
      // 获取要修改数据的id
      this.roleID = role.id;
      // 向服务器发起请求，并使用结构语法获取服务器响应的数据
      const { data: res } = await this.$http.get("rights/tree");
      // 如果服务器响应的状态码不为200，则获取数据失败
      if (res.meta.status !== 200) return this.$message.error("权限列表获取失败：" + res.meta.msg);
      // 成功后赋值给rightList属性
      this.rightList = res.data;
      // 打开dialogshu'xing对话框
      this.dialogBoxVisible = true;
      // 调用给defaultKeys属性添加元素的事件处理函数
      this.getDefaultKeys(role, this.defaultKeys);
    },
    // 【Dialog对话框点击确定按钮后】的事件处理函数
    async handleAddRights () {
      // 通过结构语法将refs获取树形结构中选中和被选中节点的key（id）值组成数组，并用，分割数字组成字符串
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()].join(",");
      // 使用Ajax向服务器发起请求，并使用解构语法获取服务器响应的结果
      const { data: res } = await this.$http.post(`roles/${this.roleID}/rights`, { rids: keys });
      // 如果服务器响应的状态码不为200，则角色授权失败
      if (res.meta.status !== 200) return this.$message.error("权限分配失败：" + res.meta.msg);
      // 否则修改成功,则dialong对话框消失
      this.dialogBoxVisible = false;
      // 更新角色列表
      this.getRoleList();
      // 并给予用户提示信息
      this.$message.success(res.meta.msg);
    },
    // 【获取每个角色已有权限的id】事件处理函数
    getDefaultKeys (node, arr) {
      // 如果节点不包含children属性,那么就证明递归结束了，将递归的id全部添加到数组中
      if (!node.children) return arr.push(node.id);
      // 如果包含就继续递归子节点
      node.children.forEach(item => this.getDefaultKeys(item, arr));
    },
    // [添加角色Dialog对话框关闭]的事件处理函数
    dialogAddClose () {
      // 重置表单数据
      this.$refs.ruleFormByAdd.resetFields()
      this.dialogAddVisible = false;
    },
    // [添加角色]的事件处理函数
    handleAddRole () {
      // 进行表单验证
      this.$refs.ruleFormByAdd.validate(async valid => {
        // 如果不符合规则,那么就结束
        if (!valid) return;
        // 表单验证通过之后,向服务器发起Ajax请求,并接收服务器响应的结果
        const { data: res } = await this.$http.post("roles", this.fromByaddRoleBy);
        console.log(res.meta.status);
        // 如果服务器响应的状态码不为200,则提示
        if (res.meta.status !== 201) return this.$message.error("添加角色失败:" + res.meta.msg);
        // 调用 [添加角色Dialog对话框关闭]的事件处理函数
        this.dialogAddClose();
        // 提示用户添加角色成功
        this.$message.success(res.meta.msg);
      })
    },
    // [删除角色]的事件处理函数
    async roleDelete (scope) {
      // 给用户弹出提示带取消和确定的按钮
      const confirmResult = await this.$confirm('此操作将永久删除该角色.是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 如果不是确定按钮,那么直接结束,并提示用户
      if (confirmResult !== "confirm") return this.$info("已取消删除");
      // 否则就向服务器发起Ajax请求,接收服务器响应的结果
      const { data: res } = await this.$http.delete("roles/" + scope.id);
      // 如果服务器响应状态不为200，则失败
      if (res.meta.status !== 200) return this.$message.error("删除角色失败:" + res.meta.msg);
      // 否则删除角色成功,重新获取角色数据
      this.getRoleList();
      // 提示成功
      this.$message.success(res.meta.msg);
    },
    // [编辑角色的dialog对话框打开]的事件处理函数
    dialogEditOpen (scope) {
      // 拿到scope中对应的角色名称和角色描述,并绑定到fromByaddRoleBy属性中
      this.fromByaddRoleBy = {
        roleName: scope.roleName,
        roleDesc: scope.roleDesc
      };
      // 拿到当前编辑角色的id
      this.roleID = scope.id;
      // 打开编辑角色的dialog对话框
      this.dialogEditVisible = true;
    },
    // [编辑角色]的事件处理函数
    async handleEditRole () {
      this.$refs.ruleFormByEdit.validate(async valid => {
        // 如果不符合规则,那么就结束
        if (!valid) return;
        // 向服务器发起Ajax请求,并接收服务器的响应
        const { data: res } = await this.$http.put(`roles/${this.roleID}`, this.fromByaddRoleBy);
        // 如果服务器响应的状态码不为200,则结束，并提示用户
        if (res.meta.status !== 200) return this.$message.error("编辑角色信息失败:" + res.meta.msg);
        // 否则编辑成功,那么调用getRoleList函数重新获取角色数据
        this.getRoleList();
        // 调用编辑角色对话框关闭的事件处理函数
        this.dialogEditClose();
        // 最后提示用户编辑成功
        this.$message.success(res.meta.msg);
      })
    },
    // [编辑角色对话框关闭]的事件处理函数
    dialogEditClose () {
      // 初始化数据
      this.fromByaddRoleBy = { roleName: '', roleDesc: '' };
      // 清空id
      this.roleID = null;
      // 关闭对话框
      this.dialogEditVisible = false;
    }

  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.add {
  text-align: left;
}
</style>