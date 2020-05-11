import Vue from 'vue';
import '@/plugins/fontawesome';
import '@/plugins/bootstrap-vue';
import '@/plugins/vue-codemirror';
import App from '@/App.vue';
import router from '@/router';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');