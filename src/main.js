import Vue from 'vue';

import router from './router';
import store from './store';

import App from './App.vue';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'font-awesome/scss/font-awesome.scss';
import './icons';
import '@/styles/index.scss'; // global css

// Mock data
if (process.env.NODE_ENV === 'development') {
  const { mockXHR } = require('../mock');
  mockXHR();
}

Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
