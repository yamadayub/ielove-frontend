import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Settings, FileText } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleNewProject = () => {
    navigate('/property-type');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center">
              <Home className="h-6 w-6 lg:h-8 lg:w-8 text-blue-600" />
              <h1 className="ml-2 lg:ml-3 text-xl lg:text-2xl font-bold text-gray-900">住宅設計</h1>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="h-5 w-5 lg:h-6 lg:w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="mb-6 lg:mb-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">プロジェクト一覧</h2>
          <p className="mt-1 lg:mt-2 text-sm lg:text-base text-gray-600">住宅設計プロジェクトを管理しましょう</p>
        </div>

        {/* 新規プロジェクト作成ボタン */}
        <div className="mb-6 lg:mb-8">
          <button
            onClick={handleNewProject}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 lg:px-6 py-3 border border-transparent text-sm lg:text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            新規プロジェクト作成
          </button>
        </div>

        {/* プロジェクト一覧 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6">
            <div className="text-center py-8 lg:py-12">
              <FileText className="mx-auto h-10 w-10 lg:h-12 lg:w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">プロジェクトがありません</h3>
              <p className="mt-1 text-sm text-gray-500">
                新規プロジェクトを作成して住宅設計を始めましょう
              </p>
              <div className="mt-4 lg:mt-6">
                <button
                  onClick={handleNewProject}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  新規プロジェクト
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 