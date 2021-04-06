<template>
  <div>
    <!-- 导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{path:'/home/roles' }">角色列表</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 权限列表 -->
    <el-table :data="rightList"
              border
              stripe
              style="width: 100%"
              height="570px">
      <el-table-column type="index"
                       align="center"></el-table-column>
      <el-table-column prop="authName"
                       label="权限名称">
      </el-table-column>
      <el-table-column prop="path"
                       label="访问路径">
      </el-table-column>
      <el-table-column prop="level"
                       label="权限等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level==0">一级权限</el-tag>
          <el-tag type="success"
                  v-if="scope.row.level==1">二级权限</el-tag>
          <el-tag type="danger"
                  v-if="scope.row.level==2">三级权限</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data () {
    return {
      // 权限列表
      rightList: []
    };
  },
  // 实例创建完毕调用的钩子函数
  created () {
    // 调用获取权限列表的函数
    this.getRightList();
  },
  methods: {
    // 获取权限列表的函数
    async getRightList () {
      // 向服务器发起请求，并使用结构语法获取服务器响应的数据
      const { data: res } = await this.$http.get("rights/list");
      // 如果服务器响应的状态码不为200，则获取数据失败
      if (res.meta.status !== 200) return this.$message.error("权限列表获取失败：" + res.meta.msg);
      // 否则将获取的数据存储到rightList属性中
      this.rightList = res.data;
    }
  }
}
</script>
<style lang="less">
.el-table {
  margin-top: 25px;
}
</style>