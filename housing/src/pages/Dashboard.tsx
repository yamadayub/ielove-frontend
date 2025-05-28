import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Home, Building2, Settings, User } from 'lucide-react';
import { useHousingStore } from '../store/housingStore';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useHousingStore();

  const handleNewProject = () => {
    navigate('/property-type');
  };

  const handleProjectClick = (projectId: string) => {
    navigate('/floor-plan-editor', { state: { projectId } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">間取りシミュレーター</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <Settings className="w-6 h-6" />
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-500">
                <User className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ウェルカムセクション */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">物件管理</h2>
          <p className="text-lg text-gray-600">間取りを作成・管理できます</p>
        </div>

        {/* 新規プロジェクト作成ボタン */}
        <div className="mb-8">
          <button
            onClick={handleNewProject}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="w-5 h-5 mr-2" />
            新規間取り作成
          </button>
        </div>

        {/* プロジェクト一覧 */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">物件一覧</h3>
          </div>
          <div className="p-6">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">物件がありません</h3>
                <p className="text-gray-500 mb-6">新しい物件を作成して間取りの作成を始めましょう</p>
                <button
                  onClick={handleNewProject}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  物件作成
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleProjectClick(project.id)}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md cursor-pointer transition-shadow"
                  >
                    <div className="flex items-center mb-4">
                      {project.type === 'detached_house' ? (
                        <Home className="w-6 h-6 text-blue-600 mr-3" />
                      ) : (
                        <Building2 className="w-6 h-6 text-green-600 mr-3" />
                      )}
                      <h4 className="text-lg font-medium text-gray-900 truncate">{project.name}</h4>
                    </div>
                    {project.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                        project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        project.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.status === 'completed' ? '完了' :
                         project.status === 'in_progress' ? '進行中' :
                         project.status === 'draft' ? '下書き' : 'アーカイブ'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(project.updated_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 