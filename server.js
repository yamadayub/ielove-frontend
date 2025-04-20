const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// sugorokuアプリケーションのためのStatic Files
app.use('/sugoroku', express.static(path.join(__dirname, 'dist/sugoroku')));

// marketplaceアプリのためのStatic Files (ルートの後に配置)
app.use(express.static(path.join(__dirname, 'dist/marketplace')));

// sugorokuのSPA処理
app.get('/sugoroku/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/sugoroku/index.html'));
});

// marketplaceのSPA処理 (その他のルート)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/marketplace/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});