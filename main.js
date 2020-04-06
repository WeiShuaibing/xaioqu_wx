import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'
import md5 from 'js-md5';
Vue.component('cu-custom',cuCustom)

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$md5 = md5;

// 配置主机host
Vue.prototype.$BASE_HOST = 'http://192.168.1.18:9002/web/'

const app = new Vue({
    ...App
})
app.$mount()
