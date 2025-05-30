import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, Building2 } from 'lucide-react';

interface PropertyInfo {
  propertyType: 'detached_house' | 'apartment_renovation';
  projectName: string;
  floorPlan: string;
  floorType: string;
  floorArea: string;
  description: string;
  specialFeatures?: string[]; // 戸建て用のこだわり仕様
}

const PropertyInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyType = location.state?.propertyType as 'detached_house' | 'apartment_renovation';

  const [formData, setFormData] = useState<PropertyInfo>({
    propertyType: propertyType || 'detached_house',
    projectName: '',
    floorPlan: '',
    floorType: '',
    floorArea: '',
    description: '',
    specialFeatures: []
  });

  const [errors, setErrors] = useState<Partial<PropertyInfo>>({});

  const handleBack = () => {
    navigate('/property-type');
  };

  const handleInputChange = (field: keyof PropertyInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSpecialFeaturesChange = (value: string, checked: boolean) => {
    setFormData(prev => {
      const currentFeatures = prev.specialFeatures || [];
      let newFeatures: string[];
      
      if (checked) {
        newFeatures = [...currentFeatures, value];
      } else {
        newFeatures = currentFeatures.filter(f => f !== value);
      }
      
      return {
        ...prev,
        specialFeatures: newFeatures
      };
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PropertyInfo> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'プロジェクト名は必須です';
    }

    if (!formData.floorPlan) {
      newErrors.floorPlan = '間取りは必須です';
    }

    if (!formData.floorArea.trim()) {
      newErrors.floorArea = '床面積は必須です';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      navigate('/floor-plan-editor', { 
        state: { 
          propertyInfo: formData 
        } 
      });
    }
  };

  const floorPlanOptions = propertyType === 'detached_house' 
    ? [
        { value: '1LDK', label: '1LDK' },
        { value: '2LDK', label: '2LDK' },
        { value: '3LDK', label: '3LDK' },
        { value: '4LDK', label: '4LDK' },
        { value: '5LDK', label: '5LDK' },
        { value: 'その他', label: 'その他' }
      ]
    : [
        { value: '1K', label: '1K' },
        { value: '1DK', label: '1DK' },
        { value: '1LDK', label: '1LDK' },
        { value: '2K', label: '2K' },
        { value: '2DK', label: '2DK' },
        { value: '2LDK', label: '2LDK' },
        { value: '3K', label: '3K' },
        { value: '3DK', label: '3DK' },
        { value: '3LDK', label: '3LDK' },
        { value: '4LDK', label: '4LDK' },
        { value: 'その他', label: 'その他' }
      ];

  const floorTypeOptions = propertyType === 'detached_house'
    ? [
        { value: '平屋', label: '平屋' },
        { value: '総二階', label: '総二階' },
        { value: '一部二階', label: '一部二階' }
      ]
    : [
        { value: '低層階（1-3階）', label: '低層階（1-3階）' },
        { value: '中層階（4-7階）', label: '中層階（4-7階）' },
        { value: '高層階（8階以上）', label: '高層階（8階以上）' },
        { value: '最上階', label: '最上階' }
      ];

  // 戸建て用のこだわり仕様オプション
  const specialFeaturesOptions = [
    { value: 'entrance_cloak', label: 'エントランスクローク' },
    { value: 'work_space', label: 'ワークスペース' },
    { value: 'walk_in_closet', label: 'ウォークインクローゼット' },
    { value: 'spacious_living', label: '広々リビング' },
    { value: 'pantry', label: 'パントリー' },
    { value: 'study_room', label: '書斎' },
    { value: 'japanese_room', label: '和室' },
    { value: 'loft', label: 'ロフト' },
    { value: 'balcony', label: 'バルコニー・テラス' },
    { value: 'garage', label: 'ガレージ' }
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
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              propertyType === 'detached_house' ? 'bg-blue-50' : 'bg-green-50'
            }`}>
              {propertyType === 'detached_house' ? (
                <Home className="w-4 h-4 text-blue-600" />
              ) : (
                <Building2 className="w-4 h-4 text-green-600" />
              )}
            </div>
            <h1 className="text-lg font-semibold text-gray-900">
              {propertyType === 'detached_house' ? '戸建て住宅' : 'マンションリノベーション'}
            </h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-2xl mx-auto px-6 py-8 pb-24">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            プロジェクト情報
          </h2>
          <p className="text-gray-600 leading-relaxed">
            設計に必要な基本情報を入力してください。後から変更することも可能です。
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* プロジェクト名 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              プロジェクト名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.projectName}
              onChange={(e) => handleInputChange('projectName', e.target.value)}
              className={`w-full px-4 py-3 border-0 border-b-2 bg-transparent focus:outline-none focus:border-gray-900 transition-colors ${
                errors.projectName ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="例：我が家のリノベーション"
            />
            {errors.projectName && (
              <p className="mt-2 text-sm text-red-600">{errors.projectName}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* 間取り */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                {propertyType === 'detached_house' ? '希望間取り' : '現在の間取り'} <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.floorPlan}
                onChange={(e) => handleInputChange('floorPlan', e.target.value)}
                className={`w-full px-4 py-3 border-0 border-b-2 bg-transparent focus:outline-none focus:border-gray-900 transition-colors ${
                  errors.floorPlan ? 'border-red-300' : 'border-gray-200'
                }`}
              >
                <option value="">選択してください</option>
                {floorPlanOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.floorPlan && (
                <p className="mt-2 text-sm text-red-600">{errors.floorPlan}</p>
              )}
            </div>

            {/* 階層・階数 */}
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-3">
                {propertyType === 'detached_house' ? '建物構造' : '所在階'}
              </label>
              <select
                value={formData.floorType}
                onChange={(e) => handleInputChange('floorType', e.target.value)}
                className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-gray-900 transition-colors"
              >
                <option value="">選択してください</option>
                {floorTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 戸建て用のこだわり仕様 */}
          {propertyType === 'detached_house' && (
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-4">
                こだわり仕様（複数選択可）
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {specialFeaturesOptions.map((option) => (
                  <label key={option.value} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value={option.value}
                      checked={formData.specialFeatures?.includes(option.value) || false}
                      onChange={(e) => {
                        handleSpecialFeaturesChange(option.value, e.target.checked);
                      }}
                      className="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 mr-3"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 床面積 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              {propertyType === 'detached_house' ? '延床面積' : '専有面積'} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.floorArea}
                onChange={(e) => handleInputChange('floorArea', e.target.value)}
                className={`w-full px-4 py-3 pr-12 border-0 border-b-2 bg-transparent focus:outline-none focus:border-gray-900 transition-colors ${
                  errors.floorArea ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder={propertyType === 'detached_house' ? "例：120" : "例：80"}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500 text-sm">㎡</span>
              </div>
            </div>
            {errors.floorArea && (
              <p className="mt-2 text-sm text-red-600">{errors.floorArea}</p>
            )}
          </div>

          {/* 要望・備考 */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              要望・備考
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border-0 border-b-2 border-gray-200 bg-transparent focus:outline-none focus:border-gray-900 transition-colors resize-none"
              placeholder={propertyType === 'detached_house' 
                ? "建築に関するご要望や特記事項があればご記入ください" 
                : "リノベーションに関するご要望や特記事項があればご記入ください"
              }
            />
          </div>

          {/* 送信ボタン */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all"
            >
              間取り編集を開始
              <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </div>
        </form>

        {/* 注意事項 */}
        <div className="mt-12 bg-gray-50 rounded-2xl p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-900 mb-2">
                ヒント
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                入力した情報は間取り編集画面でいつでも変更できます。
                まずは大まかな情報を入力して、設計を始めてみましょう。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoForm;