import React from 'react';
import { Breadcrumb } from '../navigation/Breadcrumb';

export const CommercialTransactionLaw: React.FC = () => {
  return (
    <>
      <Breadcrumb
        links={[
          { href: '/mypage', label: 'マイページ' },
          { href: '/commercial-law', label: '特定商取引法に基づく表示' },
        ]}
      />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">特定商取引法に基づく表示</h1>

        <div className="space-y-6 text-sm">
          <section>
            <h2 className="font-medium mb-2">事業者名</h2>
            <p>StyleElements合同会社</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">住所</h2>
            <p>東京都渋谷区道玄坂1丁目10番8号渋谷道玄坂東急ビル2F−C</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">連絡先</h2>
            <p>support@ietsuku.jp （お問い合わせはメールにてお願いいたします）</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">当社の役割</h2>
            <p className="leading-relaxed">
              当社はietsuku運営事業者となります。ietsuku運営事業者は、出品者と購入者へ、ietsukuの規約の制限内で決定できるインテリア・内装仕様情報およびその価格において、出品者と購入者との間のインターネット上の取引契約の「場」を提供するものであり、出品者と購入者間で締結した取引契約に関知するものではありません。従いまして、取引契約の内容・コンテンツに関する問い合わせ・苦情等については、出品者と購入者との間で決定、解決して頂くものとします。
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">料金</h2>
            <p>各出品者のページ上に表示している金額です。</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">サービスの対価以外でお客様に発生する金銭</h2>
            <p>ご利用の際に必要となる通信料はお客様のご負担となります。</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">支払い時期・支払い方法</h2>
            <p className="leading-relaxed">
              お支払い方法はサイト内に表示する方法となります。ご利用いただけるクレジットカードは、クレジットカード登録画面において指定するクレジットカードとなります。クレジットカードをご利用の場合、ご利用料金は、契約締結時にお客様がご利用のクレジットカード会社宛に請求いたします。なお、お客様のお支払いの時期は、お客様とクレジットカード会社との会員規約に基づきます。
            </p>
          </section>

          <section>
            <h2 className="font-medium mb-2">提供時期</h2>
            <p>サイト内に表示する方法によるお支払方法の手続きが完了し次第、すぐにご利用いただけます。</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">返品・キャンセルについて</h2>
            <p>コンテンツに重大な瑕疵がある場合、または購入後24時間以内の場合に限り、返金を承ります。</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">コンテンツの閲覧環境</h2>
            <p>一般的なWebブラウザでご利用いただけます。推奨環境は別途サイト内でご案内いたします。</p>
          </section>

          <section>
            <h2 className="font-medium mb-2">その他</h2>
            <p className="leading-relaxed">
              申込みの有効期限がある場合にはその期限、コンテンツに隠れた瑕疵がある場合の事業者の責任についての定めがある場合にはその内容、特別の販売条件又は提供条件がある場合にはその内容を、各出品者のページにおいて表示します。
            </p>
          </section>
        </div>
      </div>
    </>
  );
}; 