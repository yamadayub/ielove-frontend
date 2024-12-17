# イエラブ - 理想の住まいを見つけよう

## 概要
イエラブは、住宅の内装や建材の情報を共有・閲覧できるプラットフォームです。

## 機能
- 物件情報の登録・編集
- 部屋ごとの仕上げ材情報の管理
- 仕上げ材の詳細情報の閲覧（購入後）
- レスポンシブデザイン対応

## 技術スタック
- React
- TypeScript
- Vite
- Tailwind CSS
- Clerk (認証)

## 開発環境のセットアップ

```bash
# リポジトリのクローン
git clone https://github.com/yourusername/ielove.git
cd ielove

# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集して必要な環境変数を設定

# 開発サーバーの起動
npm run dev
```

## 環境変数
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk認証用の公開キー
- `VITE_APP_FRONTEND_URL`: フロントエンドのURL
- `VITE_APP_BACKEND_URL`: バックエンドのURL

## ライセンス
MIT