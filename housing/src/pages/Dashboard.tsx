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
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="w-6 h-6 text-gray-900 mr-2" />
              <h1 className="text-xl font-semibold text-gray-900">間取りシミュレーター</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* ウェルカムセクション */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">物件管理</h2>
          <p className="text-gray-600">間取りを作成・管理できます</p>
        </div>

        {/* プロジェクト一覧 */}
        <div className="bg-white">
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">物件がありません</h3>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">新しい物件を作成して間取りの作成を始めましょう</p>
              <button
                onClick={handleNewProject}
                className="inline-flex items-center px-6 py-3 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                物件作成
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                      project.type === 'detached_house' ? 'bg-blue-50' : 'bg-green-50'
                    }`}>
                      {project.type === 'detached_house' ? (
                        <Home className="w-5 h-5 text-blue-600" />
                      ) : (
                        <Building2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 truncate flex-1">{project.name}</h4>
                  </div>
                  {project.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">{project.description}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-50 text-green-700' :
                      project.status === 'in_progress' ? 'bg-blue-50 text-blue-700' :
                      project.status === 'draft' ? 'bg-gray-50 text-gray-700' :
                      'bg-yellow-50 text-yellow-700'
                    }`}>
                      {project.status === 'completed' ? '完了' :
                       project.status === 'in_progress' ? '進行中' :
                       project.status === 'draft' ? '下書き' : 'アーカイブ'}
                    </span>
                    <span className="text-xs text-gray-400">
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
  );
};

export default Dashboard; 