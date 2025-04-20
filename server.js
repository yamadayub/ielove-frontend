import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// sugorokuアプリケーションのためのStatic Files
app.use('/sugoroku', express.static(join(__dirname, 'dist/sugoroku')));

// marketplaceアプリのためのStatic Files (ルートの後に配置)
app.use(express.static(join(__dirname, 'dist/marketplace')));

// sugorokuのSPA処理
app.get('/sugoroku/*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/sugoroku/index.html'));
});

// marketplaceのSPA処理 (その他のルート)
app.get('/*', (req, res) => {
  res.sendFile(join(__dirname, 'dist/marketplace/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});