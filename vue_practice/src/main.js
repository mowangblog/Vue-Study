import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import moment from 'moment'
moment.locale('zh-cn')

import 'ant-design-vue/dist/antd.css';
import './index.css'

const app = createApp(App);
// 屏蔽警告信息
app.config.warnHandler = () => null;
app.use(Antd)
app.config.globalProperties.$moment = moment
app.mount('#app')