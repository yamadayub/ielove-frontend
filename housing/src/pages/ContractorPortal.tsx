import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MessageCircle, 
  Calendar, 
  MapPin, 
  User, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Play,
  Pause,
  Eye,
  Plus,
  Home,
  FolderOpen,
  Settings,
  Users,
  BarChart3,
  FileText,
  Bell,
  LogOut
} from 'lucide-react';

interface Project {
  id: string;
  customerName: string;
  propertyAddress: string;
  propertyType: 'detached_house' | 'apartment_renovation';
  startDate: string;
  endDate: string;
  currentPhase: 'planning' | 'design' | 'permit' | 'construction' | 'completion';
  status: 'active' | 'paused' | 'delayed' | 'completed';
  nextAction: string;
  nextActionDate: string;
  hasUnreadMessages: boolean;
  messageCount: number;
  progress: number;
  budget: number;
  contractAmount: number;
}

const ContractorPortal: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [activeMenuItem, setActiveMenuItem] = useState('projects');

  // サイドバーメニュー項目
  const menuItems = [
    { id: 'projects', label: '案件管理', icon: FolderOpen, active: true },
    { id: 'calendar', label: 'スケジュール', icon: Calendar },
    { id: 'customers', label: '顧客管理', icon: Users },
    { id: 'reports', label: 'レポート', icon: BarChart3 },
    { id: 'documents', label: '文書管理', icon: FileText },
    { id: 'settings', label: '設定', icon: Settings }
  ];

  // サンプルデータ
  const projects: Project[] = [
    {
      id: 'PRJ001',
      customerName: '田中太郎',
      propertyAddress: '東京都世田谷区桜丘1-2-3',
      propertyType: 'detached_house',
      startDate: '2024-01-15',
      endDate: '2024-06-30',
      currentPhase: 'construction',
      status: 'active',
      nextAction: '基礎工事完了検査',
      nextActionDate: '2024-02-10',
      hasUnreadMessages: true,
      messageCount: 3,
      progress: 45,
      budget: 25000000,
      contractAmount: 25000000
    },
    {
      id: 'PRJ002',
      customerName: '佐藤花子',
      propertyAddress: '神奈川県横浜市青葉区美しが丘2-4-5',
      propertyType: 'apartment_renovation',
      startDate: '2024-02-01',
      endDate: '2024-04-15',
      currentPhase: 'design',
      status: 'active',
      nextAction: '設計図面最終確認',
      nextActionDate: '2024-02-08',
      hasUnreadMessages: false,
      messageCount: 0,
      progress: 25,
      budget: 8000000,
      contractAmount: 8000000
    },
    {
      id: 'PRJ003',
      customerName: '山田一郎',
      propertyAddress: '千葉県船橋市本町3-1-7',
      propertyType: 'detached_house',
      startDate: '2023-11-01',
      endDate: '2024-03-31',
      currentPhase: 'permit',
      status: 'delayed',
      nextAction: '建築確認申請再提出',
      nextActionDate: '2024-02-12',
      hasUnreadMessages: true,
      messageCount: 1,
      progress: 15,
      budget: 30000000,
      contractAmount: 30000000
    },
    {
      id: 'PRJ004',
      customerName: '鈴木美咲',
      propertyAddress: '埼玉県さいたま市大宮区桜木町1-9-2',
      propertyType: 'apartment_renovation',
      startDate: '2024-01-20',
      endDate: '2024-03-20',
      currentPhase: 'planning',
      status: 'active',
      nextAction: '現地調査実施',
      nextActionDate: '2024-02-05',
      hasUnreadMessages: false,
      messageCount: 0,
      progress: 10,
      budget: 5000000,
      contractAmount: 5000000
    },
    {
      id: 'PRJ005',
      customerName: '高橋健太',
      propertyAddress: '東京都渋谷区恵比寿1-5-8',
      propertyType: 'apartment_renovation',
      startDate: '2024-01-10',
      endDate: '2024-04-30',
      currentPhase: 'construction',
      status: 'active',
      nextAction: '内装工事開始',
      nextActionDate: '2024-02-15',
      hasUnreadMessages: true,
      messageCount: 2,
      progress: 60,
      budget: 12000000,
      contractAmount: 12000000
    },
    {
      id: 'PRJ006',
      customerName: '伊藤美香',
      propertyAddress: '神奈川県川崎市中原区木月2-3-4',
      propertyType: 'detached_house',
      startDate: '2023-12-01',
      endDate: '2024-05-31',
      currentPhase: 'construction',
      status: 'active',
      nextAction: '屋根工事完了検査',
      nextActionDate: '2024-02-08',
      hasUnreadMessages: false,
      messageCount: 0,
      progress: 70,
      budget: 28000000,
      contractAmount: 28000000
    }
  ];

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case 'planning': return '企画・調査';
      case 'design': return '設計';
      case 'permit': return '許可申請';
      case 'construction': return '施工';
      case 'completion': return '完成・引渡し';
      default: return phase;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Play className="h-4 w-4 text-green-600" />;
      case 'paused': return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'delayed': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'completed': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'paused': return '一時停止';
      case 'delayed': return '遅延';
      case 'completed': return '完了';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.propertyAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPhase = phaseFilter === 'all' || project.currentPhase === phaseFilter;
    
    return matchesSearch && matchesStatus && matchesPhase;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // 統計データの計算
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    delayed: projects.filter(p => p.status === 'delayed').length,
    totalRevenue: projects.reduce((sum, p) => sum + p.contractAmount, 0),
    unreadMessages: projects.reduce((sum, p) => sum + (p.hasUnreadMessages ? p.messageCount : 0), 0)
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* サイドバー */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* ロゴ・会社名 */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Home className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">ドリームホーム</h1>
              <p className="text-xs text-gray-500">Project Portal</p>
            </div>
          </div>
        </div>

        {/* ナビゲーションメニュー */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenuItem === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveMenuItem(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ユーザー情報・ログアウト */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">管理者</p>
              <p className="text-xs text-gray-500">admin@example.com</p>
            </div>
          </div>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors">
            <LogOut className="h-4 w-4" />
            <span>ログアウト</span>
          </button>
        </div>
      </div>

      {/* メインコンテンツエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* トップバー */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">案件管理</h2>
              <p className="text-sm text-gray-600 mt-1">進行中のプロジェクトを管理・監視</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* 通知アイコン */}
              <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="h-5 w-5" />
                {stats.unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {stats.unreadMessages}
                  </span>
                )}
              </button>
              
              {/* 新規案件ボタン */}
              <button
                onClick={() => navigate('/property-type')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                新規案件
              </button>
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">総案件数</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <FolderOpen className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">進行中</p>
                  <p className="text-2xl font-bold">{stats.active}</p>
                </div>
                <Play className="h-8 w-8 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">遅延中</p>
                  <p className="text-2xl font-bold">{stats.delayed}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">総売上</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalRevenue / 1000000)}M</p>
                </div>
                <BarChart3 className="h-8 w-8 text-purple-200" />
              </div>
            </div>
          </div>
        </div>

        {/* フィルターとサーチ */}
        <div className="p-6 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between space-x-4">
            {/* 検索 */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="顧客名・住所で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* フィルター */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">全ステータス</option>
                  <option value="active">進行中</option>
                  <option value="paused">一時停止</option>
                  <option value="delayed">遅延</option>
                  <option value="completed">完了</option>
                </select>
              </div>

              <select
                value={phaseFilter}
                onChange={(e) => setPhaseFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">全フェーズ</option>
                <option value="planning">企画・調査</option>
                <option value="design">設計</option>
                <option value="permit">許可申請</option>
                <option value="construction">施工</option>
                <option value="completion">完成・引渡し</option>
              </select>
            </div>
          </div>
        </div>

        {/* 案件リスト */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => navigate(`/project-management?id=${project.id}`)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.customerName}
                        </h3>
                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">#{project.id}</span>
                        {project.hasUnreadMessages && (
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="h-4 w-4 text-red-500" />
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-medium">
                              {project.messageCount}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{project.propertyAddress}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>
                            {project.propertyType === 'detached_house' ? '戸建て' : 'マンション'}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(project.status)}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {getStatusLabel(project.status)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">現在のフェーズ</div>
                      <div className="text-sm font-medium text-gray-900">
                        {getPhaseLabel(project.currentPhase)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">進捗率</div>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${project.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900 min-w-[3rem]">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">開始日</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(project.startDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">完了予定</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(project.endDate)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">契約金額</div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(project.contractAmount)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Next: {project.nextAction}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({formatDate(project.nextActionDate)})
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/project-management?id=${project.id}`);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      詳細を見る
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg mb-2">該当する案件が見つかりません</div>
              <div className="text-gray-400 text-sm">
                検索条件を変更するか、新しい案件を作成してください
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractorPortal; 