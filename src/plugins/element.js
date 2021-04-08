import Vue from 'vue'
import 'element-ui/lib/theme-chalk/index.css'
import { Form, FormItem, Input, Button, Message } from 'element-ui';
import { Container, Header, Aside, Main, Menu, Submenu, MenuItem, MenuItemGroup, Select, Option } from 'element-ui';
import { Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, TableColumn, Switch, ButtonGroup, Tooltip, Pagination, Dialog, MessageBox } from 'element-ui';
import { Tag, Tree } from 'element-ui';
// 在Vue对象的原型中设置一个属性为Message,这样就有利于后期的使用
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Row);
Vue.use(Col);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(ButtonGroup);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Option);