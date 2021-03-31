import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Form, FormItem, Input, Button, Message } from 'element-ui';
// 在Vue对象的原型中设置一个属性为Message,这样就有利于后期的使用
Vue.prototype.$message = Message;


Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)