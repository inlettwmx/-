import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue';
import Home from '../components/Home.vue';
import Welcome from '../components/Welcome.vue';
import Users from '../components/Users/Users.vue';
import Roles from '../components/Rights/Roles.vue';
import Rights from '../components/Rights/Rights.vue';
import Categories from '../components/Goods/Categories.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        // 路由重定向
        {
            path: "/",
            redirect: "/login"
        },
        // 登录的路由
        {
            path: '/login',
            component: Login
        },
        {
            path: '/home',
            component: Home,
            // 二级菜单的路由
            children: [{
                    path: '/',
                    redirect: '/home/welcome'
                },
                {
                    path: '/home/welcome',
                    component: Welcome
                },
                {
                    path: '/home/users',
                    component: Users
                },
                {
                    path: '/home/roles',
                    component: Roles
                },
                {
                    path: "/home/rights",
                    component: Rights
                }, {
                    path: '/home/categories',
                    component: Categories
                }
            ]
        }
    ]
});

// 使用导航守卫，对访问的路由进行拦截处理
// to：要访问的路径，from：从哪里来，next：下一个要做的操作
router.beforeEach((to, from, next) => {
    // 如果访问的使login路由，则直接进行下一步
    if (to.path === '/login') {
        return next();
    }
    // 如果访问的是其他路由，则需要判断token令牌是否存在，如果不存在则导航到login界面
    if (!window.sessionStorage.getItem('token')) {
        return next('/login');
    }
    // token存在则继续执行
    next();
});

export default router;