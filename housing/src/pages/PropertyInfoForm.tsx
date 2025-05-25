import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Home, Building2 } from 'lucide-react';

interface PropertyInfo {
  propertyType: 'detached_house' | 'apartment_renovation';
  projectName: string;
  address: string;
  floorPlan: string;
  floorType: string;
  floorArea: string;
  budget: string;
  timeline: string;
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
    address: '',
    floorPlan: '',
    floorType: '',
    floorArea: '',
    budget: '',
    timeline: '',
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

    if (!formData.address.trim()) {
      newErrors.address = '住所は必須です';
    }

    if (!formData.floorPlan) {
      newErrors.floorPlan = '間取りは必須です';
    }

    if (!formData.floorArea.trim()) {
      newErrors.floorArea = '床面積は必須です';
    }

    if (!formData.budget) {
      newErrors.budget = '予算は必須です';
    }

    if (!formData.timeline) {
      newErrors.timeline = '工期は必須です';
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

  const budgetOptions = propertyType === 'detached_house'
    ? [
        { value: '1000万円未満', label: '1000万円未満' },
        { value: '1000-1500万円', label: '1000-1500万円' },
        { value: '1500-2000万円', label: '1500-2000万円' },
        { value: '2000-3000万円', label: '2000-3000万円' },
        { value: '3000-4000万円', label: '3000-4000万円' },
        { value: '4000万円以上', label: '4000万円以上' }
      ]
    : [
        { value: '300万円未満', label: '300万円未満' },
        { value: '300-500万円', label: '300-500万円' },
        { value: '500-800万円', label: '500-800万円' },
        { value: '800-1200万円', label: '800-1200万円' },
        { value: '1200-2000万円', label: '1200-2000万円' },
        { value: '2000万円以上', label: '2000万円以上' }
      ];

  const timelineOptions = [
    { value: '1ヶ月以内', label: '1ヶ月以内' },
    { value: '2-3ヶ月', label: '2-3ヶ月' },
    { value: '3-6ヶ月', label: '3-6ヶ月' },
    { value: '6ヶ月-1年', label: '6ヶ月-1年' },
    { value: '1年以上', label: '1年以上' },
    { value: '未定', label: '未定' }
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
          <div className="flex items-center">
            {propertyType === 'detached_house' ? (
              <Home className="w-5 h-5 text-blue-600 mr-2" />
            ) : (
              <Building2 className="w-5 h-5 text-green-600 mr-2" />
            )}
            <h1 className="text-lg font-semibold text-gray-900">
              {propertyType === 'detached_house' ? '戸建て住宅' : 'マンションリノベーション'} - 物件情報入力
            </h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              プロジェクト情報を入力してください
            </h2>
            <p className="text-gray-600">
              設計に必要な基本情報を入力してください。後から変更することも可能です。
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* プロジェクト名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                プロジェクト名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleInputChange('projectName', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.projectName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="例：我が家のリノベーション"
              />
              {errors.projectName && (
                <p className="mt-1 text-sm text-red-600">{errors.projectName}</p>
              )}
            </div>

            {/* 住所 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                住所 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="例：東京都渋谷区○○1-2-3"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 間取り */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {propertyType === 'detached_house' ? '希望間取り' : '現在の間取り'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.floorPlan}
                  onChange={(e) => handleInputChange('floorPlan', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.floorPlan ? 'border-red-300' : 'border-gray-300'
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
                  <p className="mt-1 text-sm text-red-600">{errors.floorPlan}</p>
                )}
              </div>

              {/* 階層・階数 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {propertyType === 'detached_house' ? '建物構造' : '所在階'}
                </label>
                <select
                  value={formData.floorType}
                  onChange={(e) => handleInputChange('floorType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  こだわり仕様（複数選択可）
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {specialFeaturesOptions.map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={formData.specialFeatures?.includes(option.value) || false}
                        onChange={(e) => {
                          handleSpecialFeaturesChange(option.value, e.target.checked);
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* 床面積 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {propertyType === 'detached_house' ? '延床面積' : '専有面積'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.floorArea}
                  onChange={(e) => handleInputChange('floorArea', e.target.value)}
                  className={`w-full px-3 py-2 pr-12 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.floorArea ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder={propertyType === 'detached_house' ? "例：120" : "例：80"}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <span className="text-gray-500 text-sm">㎡</span>
                </div>
              </div>
              {errors.floorArea && (
                <p className="mt-1 text-sm text-red-600">{errors.floorArea}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 予算 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {propertyType === 'detached_house' ? '建築予算' : 'リノベーション予算'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.budget ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">選択してください</option>
                  {budgetOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* 工期 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  希望工期 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.timeline ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">選択してください</option>
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.timeline && (
                  <p className="mt-1 text-sm text-red-600">{errors.timeline}</p>
                )}
              </div>
            </div>

            {/* 要望・備考 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                要望・備考
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={propertyType === 'detached_house' 
                  ? "建築に関するご要望や特記事項があればご記入ください" 
                  : "リノベーションに関するご要望や特記事項があればご記入ください"
                }
              />
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-end pt-6">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                間取り編集を開始
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        {/* 注意事項 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                ヒント
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  入力した情報は間取り編集画面でいつでも変更できます。
                  まずは大まかな情報を入力して、設計を始めてみましょう。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoForm; 