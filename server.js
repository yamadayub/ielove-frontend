import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// デバッグログ
app.use((req, res, next) => {
  console.log(`Request path: ${req.path}`);
  next();
});

// sugorokuアプリケーションのためのStatic Files
app.use('/sugoroku', express.static(join(__dirname, 'dist/sugoroku')));

// marketplaceアプリのためのStatic Files
app.use(express.static(join(__dirname, 'dist/marketplace')));

// sugorokuのSPA処理 - 明示的に/sugorokuと/sugoroku/を処理
app.get(['/sugoroku', '/sugoroku/*'], (req, res) => {
  console.log(`Serving sugoroku for path: ${req.path}`);
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