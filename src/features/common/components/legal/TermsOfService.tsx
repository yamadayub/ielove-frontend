import React from 'react';
import { Breadcrumb } from '../navigation/Breadcrumb';

export const TermsOfService: React.FC = () => {
  return (
    <>
      <Breadcrumb
        links={[
          { href: '/mypage', label: 'マイページ' },
          { href: '/terms', label: '利用規約' },
        ]}
      />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-6">ietsuku利用規約</h1>
        <p className="mb-6 text-sm">本利用規約（以下、「本規約」）は、ietsuku（以下、「本サービス」）の利用条件を定めるものです。</p>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">1. 定義</h2>
          <div className="space-y-2 text-sm">
            <p>1.1. 「出品者」とは、本サービス上でインテリア・内装の仕様情報を販売する者をいいます。</p>
            <p>1.2. 「購入者」とは、本サービス上でインテリア・内装の仕様情報を購入する者をいいます。</p>
            <p>1.3. 「利用者」とは、出品者と購入者の総称をいいます。</p>
            <p>1.4. 「コンテンツ」とは、インテリア・内装の仕様情報、図面、画像、データ等をいいます。</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">2. 本サービスの内容</h2>
          <div className="space-y-2 text-sm">
            <p>2.1. 本サービスは、出品者と購入者をつなぐインテリア・内装仕様の取引プラットフォームです。</p>
            <p>2.2. 当社は、本サービスの運営およびプロモーションを通じて、利用者の利便性向上に努めます。</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">3. 利用資格</h2>
          <p className="mb-3 text-sm">以下の条件をすべて満たす方が本サービスをご利用いただけます：</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>本サービスの理念に同意できる方</li>
            <li>インターネット環境を自己の責任で用意できる方</li>
            <li>本規約に同意し遵守できる方</li>
            <li>契約締結について法的な責任能力のある方</li>
            <li>当社指定の支払方法を利用できる方</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">4. 出品者の義務と権利</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-2 text-base">4.1. コンテンツの品質と提供条件</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>出品者は、正確なインテリア・内装仕様情報を提供する責任があります</li>
                <li>法令および業界基準に準拠したコンテンツを提供すること</li>
                <li>出品者は、該当物件の施主の了解を得た上でコンテンツを提供すること</li>
                <li>該当物件の所有者から異議申し立てがあった場合、当該コンテンツの出品は直ちに停止されます</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-base">4.2. 価格設定</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>出品者は当社が定める範囲内で自由に価格を設定できます</li>
                <li>手数料として販売価格の20%を当社に支払うものとします</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-base">4.3. 著作権</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>コンテンツの著作権は出品者に帰属します</li>
                <li>出品者は、コンテンツの販売権を当社に許諾するものとします</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">5. 購入者の義務と権利</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-2 text-base">5.1. 利用制限</h3>
              <p>第三者への転売・譲渡は禁止します</p>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-base">5.2. 支払い</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>購入者は、表示された価格を当社指定の方法で支払うものとします</li>
                <li>支払い完了後、コンテンツが閲覧可能となります</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">6. 禁止事項</h2>
          <p className="mb-3 text-sm">以下の行為を禁止します：</p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>他者の所有する物件の仕様情報を無許可で登録・販売する行為</li>
            <li>他者の知的財産権を侵害する行為</li>
            <li>虚偽または誤解を招く情報の掲載</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>法令または公序良俗に反する行為</li>
            <li>その他当社が不適切と判断する行為</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">7. サービスの停止・削除</h2>
          <div>
            <h3 className="font-medium mb-2 text-base">7.1. 当社は以下の場合、事前通知なくサービスの停止またはコンテンツの削除を行うことがあります：</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>本規約に違反した場合</li>
              <li>不適切なコンテンツと判断された場合</li>
              <li>システムメンテナンス時</li>
              <li>その他当社が必要と判断した場合</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">8. 返金ポリシー</h2>
          <div>
            <h3 className="font-medium mb-2 text-base">8.1. 以下の場合に限り、返金を認めます：</h3>
            <ul className="list-disc pl-6 space-y-2 text-sm">
              <li>コンテンツに重大な瑕疵がある場合</li>
              <li>購入後24時間以内の場合</li>
            </ul>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">9. 責任範囲</h2>
          <div className="space-y-3">
            <div>
              <h3 className="font-medium mb-2 text-base">9.1. 当社の責任は以下に限定されます：</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>プラットフォームの提供</li>
                <li>取引の場の提供</li>
                <li>適切な運営管理</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2 text-base">9.2. 以下については責任を負いません：</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>コンテンツの品質保証</li>
                <li>取引当事者間のトラブル</li>
                <li>システム障害による損害</li>
                <li>不可抗力による損害</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">10. 規約の変更</h2>
          <div className="space-y-2 text-sm">
            <p>10.1. 当社は、必要に応じて本規約を変更することがあります。</p>
            <p>10.2. 変更後の利用継続をもって、変更への同意とみなします。</p>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3">11. 準拠法と管轄</h2>
          <div className="space-y-2 text-sm">
            <p>11.1. 本規約の準拠法は日本法とします。</p>
            <p>11.2. 紛争が生じた場合は、東京地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
          </div>
        </section>
      </div>
    </>
  );
}; 