<template>
<!-- 遮罩层 -->
   <div class="login_container">
       <!-- 登录区域 -->
       <div class="login_box">
           <!-- 头像区域 -->
           <div class="avatar_box">
               <img src="../assets/logo.png" alt="我的头像" title="我的头像">
           </div>
            <!-- 表单区域 -->
             <el-form class="login_form" :model="loginUser" :rules='rules' ref='LoginFormRef'>
                 <!-- 账号 -->
                <el-form-item prop='userName'>
                    <el-input v-model="loginUser.username" prefix-icon="el-icon-user"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop='password'>
                    <el-input v-model="loginUser.password" type='password' prefix-icon="el-icon-lock"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="bts">
                    <el-button type="primary" @click='login'>登录</el-button>
                    <el-button type="info" @click='reset'>重置</el-button>
                </el-form-item>
             </el-form>
       </div>
   </div>
</template>

<script>
export default {
  data(){
      return {
        // 绑定的数据
          loginUser:{
              username:"",
              password:""
          },
        // 表单验证规则
          rules:{
             username:[
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
             ] ,
             password:[
                { required: true, message: '请输入活动名称', trigger: 'blur' },
                { min: 6, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
             ]
          }
      }
  },
  methods:{
    // 登录的事件
      login(){
        // 进行表单验证
          this.$refs.LoginFormRef.validate(async vaild=>{
            // 如果验证结果为false,就说明验证失败
              if(!vaild){
                  return;
              }
            // 否则成功
            const {data:res}=await this.$http.post('login',this.loginUser);
            // 如果状态码不为200，则登录失败
            if(res.meta.status!==200){
                // 失败则提示信息
                return this.$message.error('登录失败：'+res.meta.msg)
            }
            // 否则登录成功
            this.$message.success('登录成功！');
            // 存储登录用户的token信息
            window.sessionStorage.setItem('token',res.data.token);
            // 导航到home页面
            this.$router.push("/home");
          })
      },
    // 重置的事件
      reset(){
          this.$refs.LoginFormRef.resetFields();
      }
  }
}
</script>

<style lang="less" scoped>
    .login_container{
        height: 100%;
        background: #2b5b6b;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background: #fff;
        border-radius: 3px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        .avatar_box{
            width: 100px;
            height: 100px;
            border: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            position: absolute;
            left: 50%;
            transform: translate(-50%,-50%);
            background: #fff;
            box-shadow: 0 0 10px #ddd;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
.login_form{
    padding: 0 20px;
    position: absolute;
    bottom: 0;
    width: 100%;
    // 使用cs盒子
    box-sizing: border-box;
    .bts{
        display: flex;
        justify-content: flex-end;
    }
}
  
</style>
