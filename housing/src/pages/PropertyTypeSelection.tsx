import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Building2 } from 'lucide-react';

const PropertyTypeSelection: React.FC = () => {
  const navigate = useNavigate();

  const handlePropertyTypeSelect = (propertyType: 'detached_house' | 'apartment_renovation') => {
    if (propertyType === 'apartment_renovation') {
      navigate('/property-info-apartment', { 
        state: { 
          propertyType 
        } 
      });
    } else {
      navigate('/property-info', { 
        state: { 
          propertyType 
        } 
      });
    }
  };

  return (
    <div className="h-full flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            どちらの物件タイプですか？
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 戸建て */}
          <div
            onClick={() => handlePropertyTypeSelect('detached_house')}
            className="group bg-white rounded-2xl p-8 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-center"
          >
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Home className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              戸建て
            </h3>
            <div className="px-8 py-3 bg-gray-900 text-white font-medium rounded-full group-hover:bg-gray-800 transition-colors">
              選択する
            </div>
          </div>

          {/* マンションリノベーション */}
          <div
            onClick={() => handlePropertyTypeSelect('apartment_renovation')}
            className="group bg-white rounded-2xl p-8 border border-gray-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] text-center"
          >
            <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <Building2 className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              マンションリノベーション
            </h3>
            <div className="px-8 py-3 bg-gray-900 text-white font-medium rounded-full group-hover:bg-gray-800 transition-colors">
              選択する
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyTypeSelection; 