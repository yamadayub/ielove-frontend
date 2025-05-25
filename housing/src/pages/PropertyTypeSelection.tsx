import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Building2 } from 'lucide-react';

const PropertyTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handlePropertyTypeSelect = (propertyType: 'detached_house' | 'apartment_renovation') => {
    navigate('/property-info', { 
      state: { 
        propertyType 
      } 
    });
  };

  const propertyTypes = [
    {
      id: 'detached_house',
      title: '戸建て住宅',
      description: '新築・リフォーム・リノベーション対応',
      icon: Home,
      features: [
        '自由度の高い間取り設計',
        '構造変更も可能',
        '外構・庭の設計も対応',
        '建築基準法に準拠した設計'
      ],
      color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
    },
    {
      id: 'apartment_renovation',
      title: 'マンションリノベーション',
      description: '既存マンションの間取り変更・リノベーション',
      icon: Building2,
      features: [
        '管理規約に準拠した設計',
        '構造壁を考慮した間取り',
        '配管・電気設備の最適化',
        'バリアフリー対応'
      ],
      color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            戻る
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            物件種別の選択
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            どちらの物件タイプですか？
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            物件の種別によって設計の制約や可能な工事内容が異なります。
            適切な設計を行うために、該当する物件タイプを選択してください。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => handlePropertyTypeSelect(type.id as 'detached_house' | 'apartment_renovation')}
                className={`
                  relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200
                  ${type.color}
                `}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-white/50 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {type.title}
                    </h3>
                    <p className="text-sm opacity-80 mb-4">
                      {type.description}
                    </p>
                    <ul className="space-y-2">
                      {type.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-current mr-2 opacity-60"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {/* 選択ボタン */}
                <div className="mt-6 flex justify-end">
                  <button className="px-4 py-2 bg-white/80 text-current font-medium rounded-md hover:bg-white transition-colors">
                    選択する
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 補足情報 */}
        <div className="mt-12 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            設計について
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">戸建て住宅の場合</h4>
              <ul className="space-y-1">
                <li>• 構造計算に基づいた安全な設計</li>
                <li>• 建築基準法・地域の条例に準拠</li>
                <li>• 敷地条件を考慮した最適な配置</li>
                <li>• 将来の増改築も考慮した設計</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">マンションリノベーションの場合</h4>
              <ul className="space-y-1">
                <li>• 管理規約・使用細則の確認</li>
                <li>• 構造壁・梁の位置を考慮</li>
                <li>• 配管・電気設備の制約を確認</li>
                <li>• 近隣への騒音対策も配慮</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                ご注意
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  実際の工事を行う前には、必ず建築士や施工業者による詳細な現地調査と設計が必要です。
                  このツールで作成した間取りは参考資料としてご活用ください。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelection; 