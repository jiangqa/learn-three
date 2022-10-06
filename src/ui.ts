import { App } from 'vue'
import Container from './components/layout/LayoutContainer.vue'
import Scroll from './components/layout/LayoutScroll.vue'
import './assets/less/layout.less'
export default {
    install: (app: App) => {
        app.component('LayoutContainer', Container)
        app.component('LayoutScroll', Scroll)
    }
}
