import React from 'react';
import { Breadcrumb } from '../navigation/Breadcrumb';

export const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Breadcrumb
        links={[
          { href: '/mypage', label: 'マイページ' },
          { href: '/privacy', label: 'プライバシーポリシー' },
        ]}
      />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">プライバシーポリシー</h1>
        <p className="text-sm mb-8 leading-relaxed">
          StyleElements合同会社（以下「当社」といいます。）は、ietsuku（以下「本サービス」といいます。）をご利用いただくにあたり、利用者の皆様の個人情報を取り扱っています。当社では、個人情報保護方針に基づき、個人情報保護マネジメントシステムを確立するとともに実行し、個人情報の適切な取り扱いを実現いたします。
        </p>

        <div className="space-y-8 text-sm">
          <section>
            <h2 className="text-lg font-semibold mb-3">1. 利用する情報</h2>
            <p className="mb-2">当社が利用目的を達成するために取得する情報には、以下が含まれます：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>メールアドレス、パスワード等のアカウント情報</li>
              <li>クレジットカード情報等の決済情報</li>
              <li>サービス利用状況、IPアドレス、端末情報等の利用ログ</li>
              <li>Cookie情報</li>
              <li>本サービスに掲載されたコンテンツ、コメント等の情報</li>
              <li>お問い合わせ時の通信記録</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">2. 利用目的</h2>
            <p className="mb-2">取得した情報は、以下の目的で利用します：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>サービスの提供・運営</li>
              <li>お問い合わせ対応</li>
              <li>サービスの改善・開発</li>
              <li>利用状況の分析</li>
              <li>不正利用の防止</li>
              <li>マーケティング活動</li>
              <li>お知らせの配信</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">3. 個人情報の提供</h2>
            <p className="mb-2">以下の場合に限り、個人情報を第三者に提供することがあります：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>業務委託先に必要最小限の情報を提供する場合</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">4. Cookieの利用</h2>
            <p className="mb-2">本サービスでは、以下の目的でCookieを使用します：</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>ログイン状態の維持</li>
              <li>利用状況の分析</li>
              <li>サービスの改善</li>
              <li>広告配信の最適化</li>
            </ul>
            <p>ブラウザの設定でCookieを無効にすることが可能ですが、一部機能が利用できなくなる可能性があります。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">5. アクセス解析</h2>
            <p>本サービスでは、Googleアナリティクス等のアクセス解析ツールを使用しています。これらのツールはCookieを使用し、個人を特定しない形で利用状況を収集します。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">6. 個人情報の管理</h2>
            <p className="mb-2">当社は個人情報の管理について、以下の対策を実施します：</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>不正アクセス防止措置</li>
              <li>社内規程の整備</li>
              <li>従業員教育の実施</li>
              <li>委託先の監督</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">7. 開示請求</h2>
            <p className="mb-2">個人情報の開示・訂正・削除等のご請求は、以下の窓口で承ります：</p>
            <p>Email: support@ietsuku.jp</p>
            <p>住所: 東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F−C</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">8. プライバシーポリシーの変更</h2>
            <p>本ポリシーの内容は、法令変更や社会情勢等により、事前の予告なく変更することがあります。変更後のプライバシーポリシーは、本サービス上に掲載した時点から効力を生じるものとします。</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3">9. お問い合わせ窓口</h2>
            <p className="mb-2">本ポリシーに関するお問い合わせは、下記までご連絡ください：</p>
            <p>StyleElements合同会社</p>
            <p>Email: support@ietsuku.jp</p>
            <p>住所: 東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F−C</p>
          </section>

          <p className="text-right text-gray-600">2024年1月23日 制定</p>
        </div>
      </div>
    </>
  );
}; 