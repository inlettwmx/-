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
        <el-button type="primary">添加角色</el-button>
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
                <el-tag>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="20">
                <el-row :class="['bdbottom',index2===0?'bdtop':'','vcenter']"
                        v-for="(item2,index2) in item1.children"
                        :key="item2.id">
                  <el-col :span="5">
                    <el-tag type="success">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="20">
                    <el-tag type="danger"
                            v-for="item3 in item2.children"
                            :key="item3.id">
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
          <template>
            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="编辑"
                        placement="top-start">
              <el-button size="mini"
                         type="primary"
                         icon="el-icon-edit"></el-button>
            </el-tooltip>

            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="删除"
                        placement="top-start">
              <el-button size="mini"
                         type="danger"
                         icon="el-icon-delete"></el-button>
            </el-tooltip>

            <el-tooltip class="item"
                        :enterable="false"
                        effect="dark"
                        content="分配权限"
                        placement="top-start">
              <el-button size="mini"
                         type="warning"
                         icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {

  data () {
    return {
      // 角色列表数据
      roleList: []
    }
  },
  // 实例创建完之后立即调用的钩子函数
  created () {
    // 调用获取角色列表的函数
    this.getRoleList();
  },
  methods: {
    // 获取角色列表的函数
    async getRoleList () {
      // 向服务器发起请求，并使用解构获取服务器响应的数据
      const { data: res } = await this.$http.get("roles");
      // 如果服务器响应的状态码不为200，则获取失败
      if (res.meta.status !== 200) return this.$message.error("获取角色列表失败：" + res.meta.msg);
      // 成功后赋值给roleList属性
      this.roleList = res.data;
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