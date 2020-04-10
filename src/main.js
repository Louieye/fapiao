// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import Toast from '@/base/toast/index'
import axios from 'axios'
import { Button, Collapse, CollapseItem, Option, Dialog, Input, Select, Table, TableColumn, Upload, Message, MessageBox, Tag, Form, FormItem, Pagination } from 'element-ui'
Vue.use(Button)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Option)
Vue.use(Dialog)
Vue.use(Input)
Vue.use(Select)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Upload)
Vue.use(Tag)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Pagination)
Vue.prototype.$message = Message;
Vue.prototype.$confirm = MessageBox.confirm;

Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(Toast)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
