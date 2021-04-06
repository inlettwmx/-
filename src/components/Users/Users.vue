<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/home/users' }">用户列表</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜素框区域 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryInfor.query"
                    clearable
                    @clear="getUserList">
            <el-button type="primary"
                       slot="append"
                       icon="el-icon-search"
                       @click="getUserList">搜索</el-button>
          </el-input>
        </el-col>
        <!-- 添加用户区域 -->
        <el-col :span="4">
          <el-button type="primary"
                     icon="el-icon-circle-plus-outline"
                     @click="dialogFormVisible = true;">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table border
                :data="userList"
                stripe>
        <el-table-column type="index"
                         label="编号"
                         width="60"></el-table-column>
        <el-table-column prop="username"
                         label="姓名"></el-table-column>
        <el-table-column prop="mobile"
                         label="电话"></el-table-column>
        <el-table-column prop="email"
                         label="邮箱"></el-table-column>
        <el-table-column prop="role_name"
                         label="角色"></el-table-column>
        <!-- 状态区域 -->
        <el-table-column label="状态"
                         width="100"
                         align="center">
          <!-- 使用模板作用域插槽从外部控制数据 -->
          <template slot-scope="scope">
            <!-- 开关 -->
            <el-switch @change="userStateChange(scope.row)"
                       v-model="scope.row.mg_state"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作区域 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item"
                          effect="dark"
                          content="修改信息"
                          placement="top-start"
                          :enterable="false">
                <el-button type="primary"
                           @click="modifyUserData(scope.row)"
                           icon="el-icon-edit"></el-button>
              </el-tooltip>
              <el-tooltip class="item"
                          effect="dark"
                          content="删除用户"
                          placement="top-start"
                          :enterable="false">
                <el-button type="danger"
                           icon="el-icon-delete"
                           @click="userdel(scope.row)"></el-button>
              </el-tooltip>
              <el-tooltip class="item"
                          effect="dark"
                          content="分配角色"
                          placement="top-start"
                          :enterable="false">
                <el-button type="warning"
                           icon="el-icon-setting"></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination background
                     :current-page="queryInfor.pagenum"
                     :page-sizes="[2,4,6]"
                     :page-size="queryInfor.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentPage"
                     @prev-click="prevPage"
                     @next-click="nextPage">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               width="30%"
               @closed="dialogFormVisible = false"
               :visible.sync="dialogFormVisible">
      <el-form :model="form"
               :rules="rules"
               ref="ruleForm">
        <!-- 用户名称 -->
        <el-form-item prop="username">
          <el-input v-model="form.username"
                    autocomplete="off"
                    placeholder="请输入用户名称"
                    prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 用户密码 -->
        <el-form-item prop="password">
          <el-input v-model="form.password"
                    autocomplete="off"
                    show-password
                    placeholder="请输入用户密码"
                    prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input v-model="form.email"
                    autocomplete="off"
                    placeholder="请输入用户邮箱"
                    prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile"
                    autocomplete="off"
                    placeholder="请输入用户手机号"
                    prefix-icon="el-icon-mobile-phone"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="addUsers">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户信息"
               width="30%"
               :visible.sync="dialogAmendVisible">
      <el-form :model="modifyTheForm"
               :rules="rules"
               ref="ruleForm">
        <!-- 用户名称 -->
        <el-form-item prop="username">
          <el-input v-model="modifyTheForm.username"
                    autocomplete="off"
                    :disabled="true"
                    prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email">
          <el-input v-model="modifyTheForm.email"
                    autocomplete="off"
                    placeholder="请输入用户邮箱"
                    prefix-icon="el-icon-message"></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item prop="mobile">
          <el-input v-model="modifyTheForm.mobile"
                    autocomplete="off"
                    placeholder="请输入用户手机号"
                    prefix-icon="el-icon-mobile-phone"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogAmendVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="modifyComplete">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    // 邮箱的验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
      // 如果邮箱合法
      if (regEmail.test(value)) {
        return callback();
      }
      // 否则不合法抛出异常
      return callback('请输入合法的邮箱');
    }
    // 手机号的验证规则
    var checkMobile = (rule, value, callback) => {
      const regEmail = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;;
      // 如果邮箱合法
      if (regEmail.test(value)) {
        return callback();
      }
      // 否则不合法抛出异常
      return callback('请输入合法的手机号码');
    }
    return {
      // 用户数据列表
      userList: [],
      // 发起Ajax请求分页查询的参数
      queryInfor: {
        // 查询参数
        query: '',
        // 当前页数字
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      // 总记录数
      total: 0,
      // 是否显示添加用户的dialog对话框
      dialogFormVisible: false,
      // 是否显示修改用户信息的dialog对话框
      dialogAmendVisible: false,
      // 添加用户的数据
      form: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改用户的数据
      modifyTheForm: {
        id: null,
        username: "",
        email: "",
        mobile: ""
      },
      flag: true,
      // 表单数据验证
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      amendRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  // Vue实例创建完成后立即执行的钩子函数
  created () {
    // 获取用户信息
    this.getUserList();
  },
  methods: {
    // 获取用户数据的事件处理函数
    async getUserList () {
      // 向服务器发起请求
      const { data: res } = await this.$http.get("users", { params: this.queryInfor });
      // 如果服务器响应状态不为200，则失败
      if (res.meta.status !== 200) {
        // 响应提示信息
        return this.$message.error("用户数据获取失败：" + res.meta.msg);
      }
      // 成功后赋值给userList
      this.userList = res.data.users;
      // 获取总记录数
      this.total = res.data.total;
    },
    // 改变用户状态的事件处理函数
    async userStateChange (scope) {
      // 发起Ajax请求，进行用户状态修改
      const { data: res } = await this.$http.put(`users/${scope.id}/state/${scope.mg_state}`);
      // 如果响应的状态不为200则修改失败
      if (res.meta.status !== 200) {
        // 将用户的状态再修改回去
        scope.mg_state = !scope.mg_state;
        // 返回失败原因
        return this.$message.error("设置用户状态失败：" + res.meta.msg);
      }
      // 成功后响应数据
      this.$message.success(res.meta.msg);
    },
    // 每页条数发生改变时触发的事件处理函数
    handleSizeChange (newSize) {
      // 修改每一页的条数
      this.queryInfor.pagesize = newSize;
      // 再次调用获取用户数据的函数
      this.getUserList();
    },
    // 当前页发生改变时触发的事件处理函数
    handleCurrentPage (newPage) {
      // 当前页码发生改变的时候，修改页码数
      this.queryInfor.pagenum = newPage;
      // 再次调用获取用户数据的函数
      this.getUserList();
    },
    // 点击上一页触发的事件处理函数
    prevPage (prev) {
      // 获取上一页的页码，并赋值给queryInfor.pagenum
      this.queryInfor.pagenum = prev;
      // 再次调用获取用户数据的函数
      this.getUserList();
    },
    // 点击下一页触发的事件处理函数
    nextPage (next) {
      // 获取下一页的页码，并赋值给queryInfor.pagenum
      this.queryInfor.pagenum = next;
      // 再次调用获取用户数据的函数
      this.getUserList();
    },
    // 添加用户的数据处理函数
    addUsers () {
      this.$refs.ruleForm.validate(async valid => {
        // 如果验证不通过
        if (!valid) return;
        // 发起Ajax请求
        const { data: res } = await this.$http.post("/users", this.form);
        // 如果响应的请求码不为201，则添加用户失败
        if (res.meta.status !== 201) return this.$message.error("添加用户失败：" + res.meta.msg);
        // 否则成功，清空表单
        this.$refs.ruleForm.resetFields();
        // 页码重置
        this.queryInfor.pagenum = 1;
        // 再次调用getUserList函数,将数据渲染到模板中
        this.getUserList();
        // dialog对话框消失
        this.dialogFormVisible = false;
        // 成功后的提示
        this.$message.success(res.meta.msg);
      });
    },
    // 删除用户的事件处理函数
    async userdel (scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(async () => {
        // 发起Ajax请求
        const { data: res } = await this.$http.delete(`/users/${scope.id}`);
        // 当响应的状态码不为200,则说明删除失败
        if (res.meta.status !== 200) return this.$message.error('删除失败:' + res.meta.msg);
        // 否则删除成功,重置当前页码
        this.queryInfor.pagenum = 1;
        // 再次调用getUserList函数,将数据渲染到模板中
        this.getUserList();
        // 删除成功后的提示
        this.$message.success('删除成功!');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    // 修改用户信息dialog对话框出现的事件处理函数
    modifyUserData (scope) {
      // 解构赋值，拿到表单中的原始数据
      this.modifyTheForm = { id: scope.id, username: scope.username, email: scope.email, mobile: scope.mobile };
      // 打开弹出框
      this.dialogAmendVisible = true;
    },
    // 修改用户信息的事件处理函数
    modifyComplete () {
      this.$refs.ruleForm.validate(async valid => {
        // 如果验证不通过
        if (!valid) return;
        // 解构拿取Ajax请求需要的参数
        let data = { email: this.modifyTheForm.email, mobile: this.modifyTheForm.mobile }
        // 发起Ajax请求
        const { data: res } = await this.$http.put(`/users/${this.modifyTheForm.id}`, data);
        // 当响应的状态码不为200,则说明删除失败
        if (res.meta.status !== 200) return this.$message.error('修改失败:' + res.meta.msg);
        // 否则修改成功,重置当前页码
        this.queryInfor.pagenum = 1;
        // 不管是否修改成功都要清空表单中的数据
        this.$refs.ruleForm.resetFields();
        // 不管是否修改成功都要将dialog对话框关闭
        this.dialogAmendVisible = false;
        // 再次调用getUserList函数,将数据渲染到模板中
        this.getUserList();
        // 修改成功后的提示
        this.$message.success(res.meta.msg);
      })
    }
  }
}
</script>

<style lang="less">
.el-card,
.el-table,
.el-pagination {
  margin-top: 15px;
  text-align: center;
}
</style>