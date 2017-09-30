import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'

Vue.config.productionTip = false

fastclick.attach(document.body);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
