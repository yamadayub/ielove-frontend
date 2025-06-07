import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import logoImage from '../assets/logo.png';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/property-type');
  };

  return (
    <div className="h-full flex items-center justify-center px-4">
      <div className="text-center">
        {/* ロゴ */}
        <div className="mb-6">
          <img 
            src={logoImage} 
            alt="ietsuku logo" 
            className="w-24 h-24 sm:w-32 sm:h-32 mx-auto"
          />
        </div>
        
        {/* ブランド名 */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          ietsuku
        </h2>
        
        {/* サブタイトル */}
        <p className="text-lg sm:text-xl text-gray-600 mb-8">
          家づくりシミュレーター
        </p>
        
        {/* 物件作成ボタン */}
        <button
          onClick={handleNewProject}
          className="inline-flex items-center px-8 py-4 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="w-5 h-5 mr-3" />
          物件を作成する
        </button>
      </div>
    </div>
  );
};

export default Dashboard; 