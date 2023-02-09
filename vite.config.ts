import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import envCompatible from 'vite-plugin-env-compatible'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'

export default defineConfig({
    envPrefix: 'REACT_APP_',
    plugins: [
        react(),
        envCompatible(),
        tsconfigPaths()
    ],
    base:'/',
    resolve: {
      alias: [{ find: '@', replacement: path.resolve(__dirname, '/src') }],
    },

})




