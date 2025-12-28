import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import Components from 'unplugin-vue-components/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import { adapter } from 'vite-bundle-analyzer'
import { analyzer } from 'vite-bundle-analyzer'
import fs from 'fs-extra'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    vue(),
    vueDevTools(),
    adapter(analyzer()),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false,
        }),
      ],
    }),
    {
      name: 'chrome-extension-restructure',
      closeBundle() {
        const dist = resolve(__dirname, 'dist')

        // 1. popup/index.html
        fs.ensureDirSync(resolve(dist, 'popup'))
        fs.moveSync(resolve(dist, 'src/popup/index.html'), resolve(dist, 'popup/index.html'), {
          overwrite: true,
        })

        // 2. manifest.json
        fs.copySync(resolve(__dirname, 'src/manifest.json'), resolve(dist, 'manifest.json'))

        // 3. 删除 src 目录
        fs.removeSync(resolve(dist, 'src'))
      },
    },
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: false,
      },
      mangle: {
        toplevel: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        'content-cmc': resolve(__dirname, 'src/content/cmc.ts'),
        'content-idev': resolve(__dirname, 'src/content/idev.ts'),
      },
      output: {
        entryFileNames: (chunk) => {
          // popup 的 js 输出到 popup 文件夹
          if (chunk.name === 'popup') return 'popup/index.js'
          // background / content 输出到 scripts
          return 'scripts/[name].js'
        },
        chunkFileNames: 'scripts/[name].js',
        assetFileNames: (asset) => {
          // CSS / 图片可以放在 popup 或 scripts
          if (asset.name?.includes('popup')) return 'popup/[name][extname]'
          return 'scripts/[name][extname]'
        },
      },
    },
  },
  server: {
    open: mode === 'popup' ? '/src/popup/index.html' : false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
