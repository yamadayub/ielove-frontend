import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 pb-14 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mt-4 mb-6">家づくりスゴロクについて</h1>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">アプリの概要</h2>
          <p className="mb-4 text-gray-700">
            「家づくりスゴロク」は、家づくりの全工程を100ステップで表示し、効率的に家づくりの知識を得ることができるアプリです。
            各ステップには専門家のアドバイスと実例写真が含まれており、自分だけのメモを残すことができます。
          </p>
          <p className="text-gray-700">
            インスタグラムで公開されている「家づくりの100ステップ」の投稿から、気になるステップを見つけたら、
            そこからディープリンクでアプリを開き、前後のステップも含めて家づくりの流れを理解できます。
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">使い方</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">1. スゴロクボードの閲覧</h3>
            <p className="text-gray-700 mb-2">
              ホーム画面では、家づくりの100ステップが時系列に沿って表示されています。
              縦に伸びる線に沿って、家づくりの各フェーズとステップが表示されます。
            </p>
            <p className="text-gray-700">
              各ステップをタップすると、そのステップの詳細を確認できます。
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">2. メモの作成と管理</h3>
            <p className="text-gray-700 mb-2">
              各ステップの詳細画面で「メモを追加」ボタンをタップすると、そのステップに関するメモを残すことができます。
            </p>
            <p className="text-gray-700">
              作成したメモは「メモ一覧」で確認・管理できます。
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">3. 進捗の管理</h3>
            <p className="text-gray-700 mb-2">
              各ステップを「完了」としてマークすることで、家づくりの進捗を管理できます。
            </p>
            <p className="text-gray-700">
              「進捗状況」画面では、フェーズごとの進捗率や全体の進捗状況を確認できます。
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">お問い合わせ</h2>
          <p className="text-gray-700 mb-4">
            ご質問やご意見がありましたら、以下の方法でお問い合わせください。
          </p>
          
          <div className="space-y-2">
            <div>
              <h3 className="font-medium">メールアドレス</h3>
              <p className="text-gray-700">sugoroku-support@example.com</p>
            </div>
            
            <div>
              <h3 className="font-medium">Instagram</h3>
              <p className="text-gray-700">@ieduukuri_sugoroku</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 