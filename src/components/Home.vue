<template>
  <!-- 主页容器 -->
  <div class="home_container">
    <!-- 布局容器 -->
    <el-container>
      <!-- 头部 -->
      <el-header>
        <!-- logo部分 -->
        <div class="logo">
          <h1>
            <a href="javascript:;">华联超市</a>
          </h1>
        </div>
        <div class="title">华联超市后台管理系统</div>
        <el-button type="info"
                   @click="loginout">退出</el-button>
      </el-header>
      <!-- 主体 -->
      <el-container>
        <!-- 侧边栏 -->
        <!-- 当isCollapse为false水平折叠收起菜单的时候宽度为64px，否则为200px -->
        <el-aside :width="isCollapse?'64px':'200px'">
          <div>
            <i class="toggleButton el-icon-s-operation"
               @click="toggleCollapse"></i>
          </div>
          <!-- 1.unique-opened:是否只保持一个子菜单的展开-->
          <!-- 2.collapse:是否水平折叠收起菜单 -->
          <!-- 3.collapse-transition:是否开启折叠动画 -->
          <el-menu background-color="#545c64"
                   text-color="#fff"
                   active-text-color="#5687e2"
                   :unique-opened=true
                   :collapse-transition=false
                   :collapse=isCollapse
                   :router=true
                   :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''"
                        v-for="item in menuList"
                        :key="item.id">
              <!-- 一级菜单模板 -->
              <template #title>
                <i :class="iconsObj[item.id]"></i>&nbsp;&nbsp;&nbsp;
                <span>{{item.authName}}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item :index="subitem.path"
                            v-for="subitem in item.children"
                            :key="subitem.id"
                            @click="navState('/'+subitem.path)">
                <!-- 二级菜单模板 -->
                <template>
                  <i class="el-icon-menu"></i>
                  <span>{{subitem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 主体区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  // 数据
  data () {
    return {
      // 服务器请求的数据
      menuList: null,
      // 字体图标对象
      iconsObj: {
        '125': 'iconfont icon-user-group-Fill',
        '103': 'iconfont icon-distribution-Fill',
        '101': 'iconfont icon-buy-Fill',
        '102': 'iconfont icon-dingdan',
        '145': 'iconfont icon-calendar-Fill'
      },
      // 判断是否折叠
      isCollapse: false,
      // 获取路由嗯
      activePath: ''
    }
  },
  // 实例创建完之后立即调用
  created () {
    // 动态获取侧边菜单数据
    this.getMenuList();
    // 将本地的路径再次存储到activePath中
    this.activePath = window.sessionStorage.getItem("activePath");
  }
  , methods: {
    // 牵扯Ajax则使用异步函数
    async getMenuList () {
      // 发起Ajax请求，并等待结果，结构出data
      const { data: res } = await this.$http.get('menus');
      // 如果状态码不为200，则获取失败
      if (res.meta.status !== 200) {
        // 提示用户
        return this.$message.error('侧边栏获取失败：' + res.meta.msg)
      }
      // 否则赋值
      this.menuList = res.data;
    },
    // 是否触发水平折叠收起菜单
    toggleCollapse () {
      // 反向修改属性
      this.isCollapse = !this.isCollapse;
    },
    // 退出系统事件
    loginout () {
      // 清除所有token
      window.sessionStorage.clear();
      // 提示信息
      this.$message.success('退出成功！');
      // 路由路径导航到login
      this.$router.push("/login");
    },
    // 点击二级菜单的时候记录当前的url地址
    navState (path) {
      // 记录url地址
      this.activePath = path;
      // 存储到本地
      window.sessionStorage.setItem("activePath", path);
    }
  }
}
</script>

<style lang="less" scoped>
.home_container,
.el-container {
  height: 100%;
}
.el-menu {
  border-right: none;
}
.el-header {
  background-color: #373737;
  color: #fff;
  padding: 0;
  height: 200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    height: 40px;
    padding: 0 20px;
    margin-right: 20px;
    justify-items: center;
  }
  .title {
    color: #cccc00;
    letter-spacing: 0.5em;
    font-size: 20px;
    font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
  }
  .logo {
    display: inline-block;
    height: 100%;
    width: 199px;
    h1 {
      width: 85%;
      height: 100%;
      margin: 0 auto;
      a {
        display: block;
        text-indent: -9999px;
        overflow: hidden;
        width: 100%;
        height: 100%;
        background: url('../assets/logos1.png');
        background-size: 100% 100%;
      }
    }
  }
}
.el-container {
  .el-aside {
    background-color: #545c64;
    color: #fff;
    overflow: hidden;
    .toggleButton {
      cursor: pointer;
      width: 100%;
      height: 18px;
      text-align: center;
      padding: 10px 0;
      background: rgb(156, 151, 151);
    }
  }
  .el-main {
    background-color: #f5f5f5;
  }
}
</style>