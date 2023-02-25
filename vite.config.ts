import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        target: 'es2015',
        cssTarget: 'chrome61',
        lib: {
            entry: 'src/pure-editor/index.ts',
            formats: ['cjs', 'es', 'umd'],
            name: 'PureEditor',
            fileName: 'index',
        },
        rollupOptions: {
            external: ['vue'],
        },
    },
    plugins: [
        vue(),
        dts({
            insertTypesEntry: true,
            copyDtsFiles: false,
        }),
    ],
    envDir: './config',
})
