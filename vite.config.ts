import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/nse': {
        target: 'https://www.nseindia.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/nse/, '/api/quote-equity'),
        headers: {
          'Referer': 'https://www.nseindia.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.9',
        }
      },
      '/api/marketstack': {
        target: 'https://api.marketstack.com',
        changeOrigin: true,
        rewrite: (path) => {
          const res = path.replace(/^\/api\/marketstack/, '');
          return res.startsWith('?') ? `/v1/eod${res}` : res || '/v1/eod';
        },
      },
    },
  },
})
