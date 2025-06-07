import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// デバッグログ
app.use((req, res, next) => {
  console.log(`Request path: ${req.path}`);
  next();
});

// API プロキシ設定（sugoroku API用）
app.use('/sugoroku/steps', createProxyMiddleware({
  target: 'http://localhost:8000', // FastAPI サーバー
  changeOrigin: true,
  pathRewrite: {
    '^/sugoroku/steps': '/sugoroku/steps'
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'API server unavailable' });
  }
}));

app.use('/sugoroku/chats', createProxyMiddleware({
  target: 'http://localhost:8000', // FastAPI サーバー
  changeOrigin: true,
  pathRewrite: {
    '^/sugoroku/chats': '/sugoroku/chats'
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'API server unavailable' });
  }
}));

// housingアプリケーションのためのStatic Files
app.use('/housing', express.static(join(__dirname, 'dist/housing')));

// sugorokuアプリケーションのためのStatic Files
app.use('/sugoroku', express.static(join(__dirname, 'dist/sugoroku')));

// marketplaceアプリのためのStatic Files
app.use(express.static(join(__dirname, 'dist/marketplace')));

// housingのSPA処理 - /housing/で始まるすべてのルートを処理
app.get('/housing/*', (req, res) => {
  console.log(`Serving housing for path: ${req.path}`);
  res.sendFile(join(__dirname, 'dist/housing/index.html'));
});

// sugorokuのSPA処理 - /sugoroku/で始まるすべてのルートを処理
app.get('/sugoroku/*', (req, res) => {
  console.log(`Serving sugoroku for path: ${req.path}`);
  res.sendFile(join(__dirname, 'dist/sugoroku/index.html'));
});

// リダイレクト処理
app.get('/housing', (req, res) => {
  res.redirect(301, '/housing/');
});

// sugorokuへのアクセス処理 - パスなしでもindex.htmlを返す
app.get('/sugoroku', (req, res) => {
  console.log(`Serving sugoroku index for direct access`);
  res.sendFile(join(__dirname, 'dist/sugoroku/index.html'));
});

// marketplaceのSPA処理 (その他のルート)
app.get('/*', (req, res) => {
  console.log(`Serving marketplace for path: ${req.path}`);
  res.sendFile(join(__dirname, 'dist/marketplace/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});