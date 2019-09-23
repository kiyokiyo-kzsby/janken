import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Toasted from 'vue-toasted';
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify';

Vue.config.productionTip = false;
Vue.use(Toasted);
Vue.use(Vuetify);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
