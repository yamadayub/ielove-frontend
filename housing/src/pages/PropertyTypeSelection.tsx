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
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
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
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-y-auto">
      {/* ヘッダー */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            戻る
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            物件種別の選択
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto px-6 py-12 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            どちらの物件タイプですか？
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto leading-relaxed">
            物件の種別によって設計の制約や可能な工事内容が異なります。
            適切な設計を行うために、該当する物件タイプを選択してください。
          </p>
        </div>

        <div className="space-y-6">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => handlePropertyTypeSelect(type.id as 'detached_house' | 'apartment_renovation')}
                className="group relative p-8 rounded-3xl border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white"
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-2xl ${type.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-8 h-8 ${type.iconColor}`} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {type.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {type.description}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {type.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 rounded-full bg-gray-300 mr-3"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 選択ボタン */}
                <div className="mt-8 flex justify-end">
                  <div className="px-6 py-3 bg-gray-900 text-white font-medium rounded-full group-hover:bg-gray-800 transition-colors">
                    選択する
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 補足情報 */}
        <div className="mt-16 bg-gray-50 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            設計について
          </h3>
          <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">戸建て住宅の場合</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  構造計算に基づいた安全な設計
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  建築基準法・地域の条例に準拠
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  敷地条件を考慮した最適な配置
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  将来の増改築も考慮した設計
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">マンションリノベーションの場合</h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  管理規約・使用細則の確認
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  構造壁・梁の位置を考慮
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  配管・電気設備の制約を確認
                </li>
                <li className="flex items-start">
                  <span className="w-1 h-1 rounded-full bg-gray-400 mt-2 mr-3 flex-shrink-0"></span>
                  近隣への騒音対策も配慮
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 注意事項 */}
        <div className="mt-8 bg-amber-50 rounded-2xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-amber-200 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-amber-700" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-amber-900 mb-2">
                ご注意
              </h3>
              <p className="text-sm text-amber-800 leading-relaxed">
                実際の工事を行う前には、必ず建築士や施工業者による詳細な現地調査と設計が必要です。
                このツールで作成した間取りは参考資料としてご活用ください。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelection; 