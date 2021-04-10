<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row>
        <el-col class="add">
          <el-button type="primary"
                     @click="showAddCateDailog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树表组件 -->
      <tree-table class="table"
                  index-text="#"
                  show-index
                  border
                  :data="cateList"
                  :columns="columns"
                  :selection-type="false"
                  :expand-type="false"
                  stripe>
        <!-- 是否有效列 -->
        <template slot="isDeleted"
                  slot-scope="scope">
          <i class="el-icon-circle-check"
             v-if="!scope.row.cat_deleted"
             style="color:lightgreen"></i>
          <i class="el-icon-circle-close"
             v-if="scope.row.cat_deleted"
             style="color:red"></i>
        </template>
        <!-- 分类级别列 -->
        <template slot="level"
                  slot-scope="scope">
          <el-tag v-if="scope.row.cat_level==0">一级</el-tag>
          <el-tag type="success"
                  v-if="scope.row.cat_level==1">二级</el-tag>
          <el-tag type="danger"
                  v-if="scope.row.cat_level==2">三级</el-tag>
        </template>
        <!-- 操作列 -->
        <template slot="operate"
                  slot-scope="scope">
          <el-tooltip class="item"
                      :enterable="false"
                      effect="dark"
                      content="编辑"
                      placement="top-start">
            <el-button size="mini"
                       @click="showEditCateDailog(scope.row)"
                       type="primary"
                       icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item"
                      :enterable="false"
                      effect="dark"
                      content="删除"
                      placement="top-start">
            <el-button size="mini"
                       @click="cateDelete(scope.row)"
                       type="danger"
                       icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </tree-table>
      <!-- 分页组件 -->
      <el-pagination background
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     :page-size="queryInfo.pagesize"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[2,4,6,8]"
                     @size-change="handleSizeChange"
                     @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"
               width="30%"
               @close="addDialogClose"
               :visible.sync="dialogAddVisible">
      <el-form :model="addCateFrom"
               :rules="rules"
               label-width="80px"
               ref="addCateRef">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addCateFrom.cat_name"
                    placeholder="请输入分类名称"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="seletedKeys"
                       :options="parentCateList"
                       clearable
                       :props="options"
                       change-on-select
                       @change="handleChange"></el-cascader>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="addDialogClose">取 消</el-button>
          <el-button type="primary"
                     @click="handleAddCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类"
               width="30%"
               @close="editDialogClose"
               :visible.sync="dialogEditVisible">
      <el-form :model="editCateFrom"
               :rules="rules"
               label-width="80px"
               ref="editCateRef">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="editCateFrom.cat_name"
                    placeholder="请输入分类名称"
                    autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogClose">取 消</el-button>
          <el-button type="primary"
                     @click="handleEditCate">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 分类列表
      cateList: [],
      // 分页数据
      queryInfo: {
        // 分类级别
        type: 3,
        // 当前页码
        pagenum: 1,
        // 一页显示的数据量
        pagesize: 8,
      },
      // 数据总条数
      total: 0,
      // 表格各列的配置
      columns: [{
        label: "分类名称",
        prop: "cat_name",
        headerAlign: "center"
      }, {
        label: "是否有效",
        type: "template",
        template: "isDeleted",
        align: "center",
        headerAlign: "center"
      }, {
        label: "等级划分",
        type: "template",
        template: "level",
        align: "center",
        headerAlign: "center"
      }, {
        label: "操作",
        type: "template",
        template: "operate",
        align: "center",
        headerAlign: "center"
      }],
      // 添加分类对话框是否打开的属性
      dialogAddVisible: false,
      // 编辑分类对话框是否打开的属性
      dialogEditVisible: false,
      // 添加分类的表单数据
      addCateFrom: {
        // 分类父id
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // 分类层级
        cat_level: 0
      },
      // 表单验证
      rules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的数据
      parentCateList: [],
      // 选中的父级分类的id
      seletedKeys: [],
      // 配置选项
      options: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 编辑分类的表单数据
      editCateFrom: {
        cat_name: "",
        cat_id: null
      }
    }
  },
  // 实例创建完成立马调用的钩子函数
  created () {
    // 调用获取分类列表的异步函数
    this.getCateList();
  },
  methods: {
    // 获取分类列表数据的事件处理函数
    async getCateList () {
      // 向服务器发起Ajax请求，并通过解构接收服务器的响应
      const { data: res } = await this.$http.get("categories", { params: this.queryInfo });
      // 如果服务器响应的状态码不为200，则获取数据失败
      if (res.meta.status !== 200) return this.$message.error("商品分类列表获取失败：" + res.meta.msg);
      // 否则成功，记录数据
      this.cateList = res.data.result;
      // 记录数据总条数
      this.total = res.data.total;
    },
    // 每页条数改变时触发的事件处理函数
    handleSizeChange (newPageSize) {
      // 获取当前条数并重新赋值给queryInfo.pagesize
      this.queryInfo.pagesize = newPageSize;
      // 再次调用获取用户数据的函数
      this.getCateList();
    },
    // 当前页改变时触发的事件处理函数
    handleCurrentChange (newPageNum) {
      // 获取当前页码并重新赋值给queryInfo.pagenum
      this.queryInfo.pagenum = newPageNum;
      // 再次调用获取用户数据的函数
      this.getCateList();
    },
    // 添加分类对话框打开的事件处理函数
    showAddCateDailog () {
      // 调用获取父级分类列表的事件处理函数
      this.getParentCateList();
      this.dialogAddVisible = true;
    },
    // 当选中节点变化时触发的事件处理函数
    handleChange () {
      // 先判断添加的是1级还是2即分类，使用this.seletedKeys（选中的父级分类的id）属性判断
      // 如果长度大于0，则有可能是1级或者2级
      if (this.seletedKeys.length > 0) {
        // 那么不管是1级还是2级，我们拿数组中最后一个级别的id即可，并把它放到表单属性中
        this.addCateFrom.cat_pid = this.seletedKeys[this.seletedKeys.length - 1];
        // 那么this.seletedKeys的长度就是要操作的分类级别，并结束该函数
        return this.addCateFrom.cat_level = this.seletedKeys.length;
      }
      // 否则就是没有选择，那么就重新初始化即可
      this.addCateFrom.cat_pid = 0;
      this.addCateFrom.cat_level = 0;
    },
    // 获取父级分类列表(2级以上，包括2级)
    async getParentCateList () {
      // 向服务器发起Ajax请求，并通过解构接收服务器的响应
      const { data: res } = await this.$http.get("categories", { params: { type: 2 } });
      // 如果服务器响应的状态码不为200，则获取数据失败
      if (res.meta.status !== 200) return this.$message.error("商品分类列表获取失败：" + res.meta.msg);
      // 否则成功，记录数据
      this.parentCateList = res.data;
    },
    // 添加分类的事件处理函数
    handleAddCate () {
      // 进行表单验证
      this.$refs.addCateRef.validate(async valid => {
        // 如果不通过，则结束
        if (!valid) return;
        // 否则通过，向服务器发起Ajax请求，接收服务器响应的结果
        const { data: res } = await this.$http.post("/categories", this.addCateFrom);
        // 如果服务器响应的状态码不为200，则获取数据失败
        if (res.meta.status !== 201) return this.$message.error("添加分类失败：" + res.meta.msg);
        // 调用获取分类列表数据的事件处理函数
        this.getCateList();
        // 否则成功，调用对话框关闭的事件处理函数
        this.addDialogClose();
        // 提示成功
        this.$message.success(res.meta.msg);
      })
    },
    // 添加分类对话框关闭的事件处理函数
    addDialogClose () {
      // 清空表单数据
      this.$refs.addCateRef.resetFields();
      // 初始化表达绑定的数据
      this.addCateFrom = {
        // 分类父id
        cat_pid: 0,
        // 分类名称
        cat_name: "",
        // 分类层级
        cat_level: 0
      };
      // 清空选中的父级分类的id
      this.seletedKeys = [];
      // 关闭对话框
      this.dialogAddVisible = false;
    },
    // 删除分类的事件处理函数
    async cateDelete (scope) {
      // 询问用户是否删除，并获取操作的结果
      const confirmResult = await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);
      // 如果不是确定按钮，那么结束函数，并提示
      if (confirmResult !== "confirm") return this.$message.info("已取消删除");
      // 否则就是删除，那么就向服务器发起Ajax请求
      const { data: res } = await this.$http.delete("categories/" + scope.cat_id);
      // 如果服务器响应状态不为200，则失败
      if (res.meta.status !== 200) return this.$message.error("删除失败：" + res.meta.msg);
      // 否则成功，刷新数据
      this.getCateList();
      // 并提示删除成功
      this.$message.success(res.meta.msg);
    },
    // 编辑分类对话框打开的事件处理函数
    showEditCateDailog (scope) {
      // 获取当前分类的名称和id，并记录到cat_name和cat_id属性中
      this.editCateFrom = {
        cat_name: scope.cat_name,
        cat_id: scope.cat_id
      }
      // 打开对话框
      this.dialogEditVisible = true;
    },
    // 编辑分类的事件处理函数
    handleEditCate () {
      // 进行表单验证
      this.$refs.editCateRef.validate(async valid => {
        // 如果验证规则不通过，则结束函数
        if (!valid) return;
        // 否则通过，那么就向服务器发起Ajax请求,并接收服务器响应的结果
        const { data: res } = await this.$http.put(`categories/${this.editCateFrom.cat_id}`, { cat_name: this.editCateFrom.cat_name });
        // 如果服务器响应的状态码不为200，则编辑失败
        if (res.meta.status !== 200) return this.$message.error("编辑失败：" + res.meta.msg);
        // 否则成功，那么重新加载数据
        this.getCateList();
        // 调用编辑分类对话框关闭的事件处理函数
        this.editDialogClose();
        // 提示用户更新成功
        this.$message.success(res.meta.msg);
      })
    },
    // 编辑分类对话框关闭的事件处理函数
    editDialogClose () {
      // 重置表单数据
      this.$refs.editCateRef.resetFields();
      // 初始化数据
      this.editCateFrom = {
        cat_name: "",
        cat_id: null
      }
      // 关闭对话框
      this.dialogEditVisible = false;
    }

  }
}
</script>

<style lang="less" scoped>
.el-card,
.table {
  margin-top: 10px;
}
.table {
  max-height: 430px;
  overflow-y: auto;
}
.add {
  text-align: left;
}
</style>