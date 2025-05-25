import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Building2, ArrowRight } from 'lucide-react';

const PropertyTypeSelection: React.FC = () => {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<'detached_house' | 'apartment_renovation' | null>(null);

  const handleBack = () => {
    navigate('/dashboard');
  };

  const handleNext = () => {
    if (selectedType) {
      navigate('/property-info', { state: { propertyType: selectedType } });
    }
  };

  const propertyTypes = [
    {
      id: 'detached_house' as const,
      title: '戸建て住宅',
      description: '新築・リフォームの戸建て住宅設計',
      icon: Home,
      features: ['間取り設計', '外観デザイン', '構造設計', '設備計画']
    },
    {
      id: 'apartment_renovation' as const,
      title: 'マンションリノベーション',
      description: 'マンション室内のリノベーション設計',
      icon: Building2,
      features: ['間取り変更', '内装デザイン', '設備更新', '収納計画']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 lg:py-6">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-4 h-4 mr-1 lg:mr-2" />
                <span className="hidden sm:inline">戻る</span>
              </button>
              <h1 className="ml-4 lg:ml-6 text-xl lg:text-2xl font-bold text-gray-900">物件タイプ選択</h1>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 lg:mb-4">設計する物件タイプを選択してください</h2>
          <p className="text-base lg:text-lg text-gray-600">
            プロジェクトの種類に応じて最適な設計ツールを提供します
          </p>
        </div>

        {/* 物件タイプ選択 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mb-6 lg:mb-8">
          {propertyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <div
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`relative rounded-lg border-2 p-4 lg:p-6 cursor-pointer transition-all ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400'
                }`}
              >
                <div className="flex items-center mb-3 lg:mb-4">
                  <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${
                    selectedType === type.id ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                  <h3 className={`ml-2 lg:ml-3 text-lg lg:text-xl font-semibold ${
                    selectedType === type.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {type.title}
                  </h3>
                </div>
                <p className={`text-sm mb-3 lg:mb-4 ${
                  selectedType === type.id ? 'text-blue-700' : 'text-gray-600'
                }`}>
                  {type.description}
                </p>
                <ul className="space-y-1 lg:space-y-2">
                  {type.features.map((feature, index) => (
                    <li key={index} className={`text-sm flex items-center ${
                      selectedType === type.id ? 'text-blue-600' : 'text-gray-500'
                    }`}>
                      <span className="w-1.5 h-1.5 bg-current rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>
                {selectedType === type.id && (
                  <div className="absolute top-3 lg:top-4 right-3 lg:right-4">
                    <div className="w-5 h-5 lg:w-6 lg:h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 lg:w-4 lg:h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 次へボタン */}
        <div className="flex justify-end">
          <button
            onClick={handleNext}
            disabled={!selectedType}
            className={`w-full sm:w-auto inline-flex items-center justify-center px-4 lg:px-6 py-3 border border-transparent text-sm lg:text-base font-medium rounded-md ${
              selectedType
                ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                : 'text-gray-400 bg-gray-200 cursor-not-allowed'
            }`}
          >
            次へ
            <ArrowRight className="ml-2 w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelection; 