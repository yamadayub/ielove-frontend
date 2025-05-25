import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

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
}

const PropertyInfoForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const propertyType = location.state?.propertyType;

  const [formData, setFormData] = useState<PropertyInfo>({
    propertyType: propertyType || 'detached_house',
    projectName: '',
    address: '',
    floorPlan: '',
    floorType: '',
    floorArea: '',
    budget: '',
    timeline: '',
    description: ''
  });

  const handleBack = () => {
    navigate('/property-type');
  };

  const handleNext = () => {
    // フォームの基本的なバリデーション
    if (formData.projectName && formData.floorPlan && formData.floorType && formData.floorArea) {
      // 間取り編集画面に遷移
      navigate('/floor-plan-editor', { state: { propertyInfo: formData } });
    } else {
      alert('必須項目を入力してください');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isFormValid = formData.projectName && formData.floorPlan && formData.floorType && formData.floorArea;

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
              <h1 className="ml-4 lg:ml-6 text-xl lg:text-2xl font-bold text-gray-900">物件情報入力</h1>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 lg:px-6 py-6 lg:py-8">
            <div className="mb-6 lg:mb-8">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-2">プロジェクト詳細情報</h2>
              <p className="text-sm lg:text-base text-gray-600">
                設計に必要な基本情報を入力してください
              </p>
            </div>

            <form className="space-y-4 lg:space-y-6">
              {/* プロジェクト名 */}
              <div>
                <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
                  プロジェクト名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="例: 田中邸新築工事"
                />
              </div>

              {/* 住所 */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  住所
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="例: 東京都渋谷区..."
                />
              </div>

              {/* 間取り */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <div>
                  <label htmlFor="floorPlan" className="block text-sm font-medium text-gray-700 mb-2">
                    間取り <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="floorPlan"
                    name="floorPlan"
                    value={formData.floorPlan}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="">選択してください</option>
                    <option value="1R">1R</option>
                    <option value="1K">1K</option>
                    <option value="1DK">1DK</option>
                    <option value="1LDK">1LDK</option>
                    <option value="2K">2K</option>
                    <option value="2DK">2DK</option>
                    <option value="2LDK">2LDK</option>
                    <option value="3K">3K</option>
                    <option value="3DK">3DK</option>
                    <option value="3LDK">3LDK</option>
                    <option value="4LDK">4LDK</option>
                    <option value="5LDK以上">5LDK以上</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="floorType" className="block text-sm font-medium text-gray-700 mb-2">
                    階数 <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="floorType"
                    name="floorType"
                    value={formData.floorType}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  >
                    <option value="">選択してください</option>
                    <option value="平屋">平屋</option>
                    <option value="2階建て">2階建て</option>
                    <option value="3階建て">3階建て</option>
                    <option value="その他">その他</option>
                  </select>
                </div>
              </div>

              {/* 延床面積 */}
              <div>
                <label htmlFor="floorArea" className="block text-sm font-medium text-gray-700 mb-2">
                  延床面積 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="floorArea"
                    name="floorArea"
                    value={formData.floorArea}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                    placeholder="例: 100"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 text-sm">㎡</span>
                  </div>
                </div>
              </div>

              {/* 予算 */}
              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  予算
                </label>
                <select
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option value="">選択してください</option>
                  <option value="1000万円未満">1000万円未満</option>
                  <option value="1000-2000万円">1000-2000万円</option>
                  <option value="2000-3000万円">2000-3000万円</option>
                  <option value="3000-4000万円">3000-4000万円</option>
                  <option value="4000-5000万円">4000-5000万円</option>
                  <option value="5000万円以上">5000万円以上</option>
                </select>
              </div>

              {/* 工期 */}
              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 mb-2">
                  希望工期
                </label>
                <select
                  id="timeline"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                >
                  <option value="">選択してください</option>
                  <option value="3ヶ月以内">3ヶ月以内</option>
                  <option value="6ヶ月以内">6ヶ月以内</option>
                  <option value="1年以内">1年以内</option>
                  <option value="1年以上">1年以上</option>
                  <option value="未定">未定</option>
                </select>
              </div>

              {/* 備考 */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  備考・要望
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm lg:text-base"
                  placeholder="特別な要望や注意事項があれば記入してください"
                />
              </div>
            </form>
          </div>

          {/* フッター */}
          <div className="px-4 lg:px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!isFormValid}
                className={`w-full sm:w-auto inline-flex items-center justify-center px-4 lg:px-6 py-3 border border-transparent text-sm lg:text-base font-medium rounded-md ${
                  isFormValid
                    ? 'text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    : 'text-gray-400 bg-gray-200 cursor-not-allowed'
                }`}
              >
                間取り編集へ
                <ArrowRight className="ml-2 w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyInfoForm; 