import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入全局样式
import './assets/global.css';
// 导入字体图标的样式
import './assets/font/iconfont.css';
// 导入axios
import axios from 'axios';
import TreeTable from 'vue-table-with-tree-grid';

Vue.component("tree-table", TreeTable);
Vue.config.productionTip = false;
// 给后端路由的URL过滤
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
// axios使用请求拦截器
axios.interceptors.request.use(config => {
    // 设置Authorization请求头
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config;
});
// 在Vue对象的原型中设置一个属性为axios,这样就有利于后期的使用
Vue.prototype.$http = axios;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');