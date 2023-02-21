import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, './config')
    return {
        base: env.VITE_BUILD_BASE,
        build: {
            target: 'es2015',
            cssTarget: 'chrome61',
            lib: {
                entry: 'src/pure-editor/index.ts',
                formats: ['cjs', 'es', 'umd'],
                name: 'pure-editor',
                fileName: 'pure-editor',
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
    }
})
