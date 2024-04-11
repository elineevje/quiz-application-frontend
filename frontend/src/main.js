import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import piniaPersistedState from "pinia-plugin-persistedstate"
import {createPinia } from 'pinia'

const pinia = createPinia()
pinia.use(piniaPersistedState)

library.add(fas)

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(pinia).use(router).mount('#app')
