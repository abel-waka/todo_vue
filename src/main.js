import { createApp } from 'vue'
import VueRoughNotation from 'vue-rough-notation';
import './style.css'
import App from './App.vue'

const app = createApp(App);
app.use(VueRoughNotation);
app.mount("#app");
