import { defineConfig } from 'vitest/config'
import { mdxPlugin } from './mdx.config'

// vite.config.ts の devtools / cloudflare / tanstackStart は vitest 上では起動できない
export default defineConfig({
  plugins: [mdxPlugin()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
