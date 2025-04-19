const fs = require('fs');
const path = require('path');
const https = require('https');
const { createWriteStream } = require('fs');

// 保存先のディレクトリ
const outputDir = path.join(__dirname, '..', 'public', 'images', 'mock');

// ディレクトリが存在しない場合は作成
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// カテゴリーリスト
const categories = ['house', 'architecture', 'interior', 'renovation'];

// ダウンロードする画像の情報
const imagesToDownload = [];

// 100ステップ、各ステップ2枚の画像を用意
for (let stepId = 1; stepId <= 100; stepId++) {
  for (let index = 1; index <= 2; index++) {
    // stepIdに基づいてカテゴリーを決定
    const categoryIndex = stepId % 4 === 0 ? 0 : 
                          stepId % 3 === 0 ? 1 :
                          stepId % 2 === 0 ? 2 : 3;
    const category = categories[categoryIndex];
    
    // 画像の情報
    imagesToDownload.push({
      stepId,
      index,
      category,
      url: `https://source.unsplash.com/random/640x480/?${category},home,${stepId}`,
      filename: `${category}_${stepId}_${index}.jpg`
    });
  }
}

// 一度に多すぎるリクエストを送らないよう、バッチ処理する
async function downloadImages() {
  console.log(`Starting download of ${imagesToDownload.length} images...`);
  
  // 5枚ずつバッチ処理
  const batchSize = 5;
  let completed = 0;
  
  for (let i = 0; i < imagesToDownload.length; i += batchSize) {
    const batch = imagesToDownload.slice(i, i + batchSize);
    
    // 各バッチの画像を並行してダウンロード
    await Promise.all(batch.map(image => downloadImage(image)));
    
    completed += batch.length;
    console.log(`Downloaded ${completed}/${imagesToDownload.length} images`);
    
    // APIレート制限を回避するための遅延
    if (i + batchSize < imagesToDownload.length) {
      console.log('Waiting a bit before the next batch...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('All images downloaded successfully!');
}

// 画像をダウンロードして保存する関数
function downloadImage(image) {
  return new Promise((resolve, reject) => {
    const outputPath = path.join(outputDir, image.filename);
    
    // 既に存在する場合はスキップ
    if (fs.existsSync(outputPath)) {
      console.log(`File already exists: ${image.filename}`);
      resolve();
      return;
    }
    
    console.log(`Downloading: ${image.filename} from ${image.url}`);
    
    const file = createWriteStream(outputPath);
    
    https.get(image.url, response => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${image.filename}`);
        resolve();
      });
    }).on('error', err => {
      fs.unlink(outputPath, () => {}); // エラー時にファイルを削除
      console.error(`Error downloading ${image.filename}: ${err.message}`);
      reject(err);
    });
  });
}

// ダウンロード実行
downloadImages().catch(error => {
  console.error('Download failed:', error);
}); 