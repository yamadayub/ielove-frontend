import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { spawn } from 'child_process';

const app = express();
const PORT = 3000;

// marketplaceとsugorokuのサーバーを起動
console.log('Starting dev servers...');
const marketplaceServer = spawn('npm', ['run', 'dev:marketplace'], { stdio: 'inherit', shell: true });
const sugorokuServer = spawn('npm', ['run', 'dev:sugoroku'], { stdio: 'inherit', shell: true });

// デバッグログ用ミドルウェア
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// sugorokuアプリへのプロキシ設定
app.use('/sugoroku', createProxyMiddleware({
  target: 'http://localhost:5174',
  changeOrigin: true,
  pathRewrite: {
    '^/sugoroku': '/'
  },
  ws: true,
  logLevel: 'debug'
}));

// marketplaceアプリへのプロキシ設定
app.use('/', createProxyMiddleware({
  target: 'http://localhost:5173',
  changeOrigin: true,
  ws: true,
  logLevel: 'debug'
}));

// サーバー起動
app.listen(PORT, () => {
  console.log(`Dev proxy server running at http://localhost:${PORT}`);
  console.log(`- Marketplace: http://localhost:${PORT}/`);
  console.log(`- Sugoroku: http://localhost:${PORT}/sugoroku/`);
});

// プロセス終了時の後処理
process.on('SIGINT', () => {
  console.log('Shutting down dev servers...');
  marketplaceServer.kill();
  sugorokuServer.kill();
  process.exit();
}); 