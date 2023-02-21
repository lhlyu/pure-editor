import type { App } from 'vue'
import './index.scss'
import PureEditor from './PureEditor.vue'

export function install(app: App) {
    app.component('PureEditor', PureEditor)
}

export default {
    install,
}

export { PureEditor }
