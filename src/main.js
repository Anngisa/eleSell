// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import axios from 'axios';
import router from './router';
import './common/stylus/index.styl';

/*全局注册*/
Vue.config.productionTip = false;
Vue.prototype.$axios=axios;
/* eslint-disable no-new */
let vm = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
}); 
Vue.use({
	vm
});
