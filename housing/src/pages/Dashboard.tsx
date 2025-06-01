import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Home, Building2, Settings, User, MessageSquare, FileText, Bell, Calendar } from 'lucide-react';
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

  const handleMessagesClick = (projectId: string) => {
    navigate(`/client-messages?projectId=${projectId}`);
  };

  const handleFilesClick = (projectId: string) => {
    navigate(`/client-files?projectId=${projectId}`);
  };

  // サンプルの進行中プロジェクト（工務店とのコミュニケーションが必要なもの）
  const ongoingProjects = [
    {
      id: 'PRJ001',
      name: '世田谷区桜丘の戸建てリノベーション',
      contractorName: '山田工務店',
      propertyAddress: '東京都世田谷区桜丘1-2-3',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      progress: 45,
      unreadMessages: 1,
      newFiles: 2,
      nextMeeting: '2024-02-15T14:00:00Z'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダー */}
      <div className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* 進行中のプロジェクト（工務店とのコミュニケーション） */}
        {ongoingProjects.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">進行中のプロジェクト</h2>
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {ongoingProjects.map((project) => (
                <div key={project.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{project.name}</h3>
                      <div className="text-sm text-gray-600 mb-2">
                        <div>施工業者: {project.contractorName}</div>
                        <div>所在地: {project.propertyAddress}</div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(project.startDate).toLocaleDateString('ja-JP')} - {new Date(project.endDate).toLocaleDateString('ja-JP')}
                          </span>
                        </div>
                        <div>進捗: {project.progress}%</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.unreadMessages > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {project.unreadMessages}
                        </span>
                      )}
                      {project.newFiles > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {project.newFiles}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* 進捗バー */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>工事進捗</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* アクションボタン */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleMessagesClick(project.id)}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      メッセージ
                      {project.unreadMessages > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {project.unreadMessages}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleFilesClick(project.id)}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      ファイル
                      {project.newFiles > 0 && (
                        <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                          {project.newFiles}
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => handleProjectClick(project.id)}
                      className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <Home className="h-4 w-4 mr-2" />
                      間取り確認
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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