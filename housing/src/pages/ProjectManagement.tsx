import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MessageCircle, 
  FileText, 
  MapPin, 
  Edit,
  Send,
  Upload,
  Download,
  User,
  Clock,
  ChevronRight,
  MessageSquare,
  Home,
  ChefHat,
  Bath,
  Bed,
  Sofa,
  Settings,
  ArrowLeft as BackIcon
} from 'lucide-react';

interface Task {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
  assignee: string;
  dependencies?: string[];
}

interface Message {
  id: string;
  sender: 'contractor' | 'customer';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface MessageThread {
  id: string;
  title: string;
  category: 'general' | 'room' | 'specification';
  icon: React.ComponentType<any>;
  lastMessage?: Message;
  unreadCount: number;
  messages: Message[];
}

interface ProjectFile {
  id: string;
  name: string;
  type: 'design' | 'contract' | 'permit' | 'photo' | 'other';
  uploadDate: string;
  size: string;
  version: number;
  uploadedBy: string;
}

const ProjectManagement: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id');
  
  const [activeTab, setActiveTab] = useState<'schedule' | 'messages' | 'files'>('schedule');
  const [newMessage, setNewMessage] = useState('');
  const [selectedThread, setSelectedThread] = useState<string | null>(null);

  // サンプルプロジェクトデータ
  const project = {
    id: projectId || 'PRJ001',
    customerName: '田中太郎',
    propertyAddress: '東京都世田谷区桜丘1-2-3',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 45,
    contractAmount: 25000000
  };

  // サンプルタスクデータ
  const tasks: Task[] = [
    {
      id: 'T001',
      name: '現地調査・測量',
      startDate: '2024-01-15',
      endDate: '2024-01-20',
      progress: 100,
      status: 'completed',
      assignee: '山田設計士'
    },
    {
      id: 'T002',
      name: '基本設計',
      startDate: '2024-01-21',
      endDate: '2024-02-10',
      progress: 100,
      status: 'completed',
      assignee: '山田設計士'
    },
    {
      id: 'T003',
      name: '実施設計',
      startDate: '2024-02-11',
      endDate: '2024-03-05',
      progress: 80,
      status: 'in_progress',
      assignee: '山田設計士'
    },
    {
      id: 'T004',
      name: '建築確認申請',
      startDate: '2024-03-06',
      endDate: '2024-03-25',
      progress: 0,
      status: 'not_started',
      assignee: '佐藤事務'
    },
    {
      id: 'T005',
      name: '基礎工事',
      startDate: '2024-04-01',
      endDate: '2024-04-20',
      progress: 0,
      status: 'not_started',
      assignee: '鈴木工務店'
    }
  ];

  // メッセージスレッドデータ
  const messageThreads: MessageThread[] = [
    {
      id: 'general',
      title: '案件全体',
      category: 'general',
      icon: Home,
      unreadCount: 2,
      lastMessage: {
        id: 'msg_gen_003',
        sender: 'customer',
        senderName: '田中太郎',
        content: '工事の進捗はいかがでしょうか？',
        timestamp: '2024-02-08T14:30:00Z'
      },
      messages: [
        {
          id: 'msg_gen_001',
          sender: 'contractor',
          senderName: '工務店担当者',
          content: 'プロジェクトを開始いたします。よろしくお願いいたします。',
          timestamp: '2024-01-15T09:00:00Z'
        },
        {
          id: 'msg_gen_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: 'こちらこそよろしくお願いします。',
          timestamp: '2024-01-15T10:30:00Z'
        },
        {
          id: 'msg_gen_003',
          sender: 'customer',
          senderName: '田中太郎',
          content: '工事の進捗はいかがでしょうか？',
          timestamp: '2024-02-08T14:30:00Z'
        }
      ]
    },
    {
      id: 'kitchen',
      title: 'キッチン',
      category: 'room',
      icon: ChefHat,
      unreadCount: 1,
      lastMessage: {
        id: 'msg_kit_002',
        sender: 'customer',
        senderName: '田中太郎',
        content: 'IHコンロの色を変更したいのですが可能でしょうか？',
        timestamp: '2024-02-07T16:45:00Z'
      },
      messages: [
        {
          id: 'msg_kit_001',
          sender: 'contractor',
          senderName: '工務店担当者',
          content: 'キッチンの仕様について確認させていただきます。',
          timestamp: '2024-02-05T11:00:00Z'
        },
        {
          id: 'msg_kit_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: 'IHコンロの色を変更したいのですが可能でしょうか？',
          timestamp: '2024-02-07T16:45:00Z'
        }
      ]
    },
    {
      id: 'living',
      title: 'リビング・ダイニング',
      category: 'room',
      icon: Sofa,
      unreadCount: 0,
      lastMessage: {
        id: 'msg_liv_001',
        sender: 'contractor',
        senderName: '工務店担当者',
        content: 'フローリングの色見本をお持ちします。',
        timestamp: '2024-02-06T13:20:00Z'
      },
      messages: [
        {
          id: 'msg_liv_001',
          sender: 'contractor',
          senderName: '工務店担当者',
          content: 'フローリングの色見本をお持ちします。',
          timestamp: '2024-02-06T13:20:00Z'
        }
      ]
    },
    {
      id: 'bathroom',
      title: 'バスルーム',
      category: 'room',
      icon: Bath,
      unreadCount: 0,
      lastMessage: {
        id: 'msg_bath_001',
        sender: 'contractor',
        senderName: '工務店担当者',
        content: 'ユニットバスの仕様書をお送りします。',
        timestamp: '2024-02-04T10:15:00Z'
      },
      messages: [
        {
          id: 'msg_bath_001',
          sender: 'contractor',
          senderName: '工務店担当者',
          content: 'ユニットバスの仕様書をお送りします。',
          timestamp: '2024-02-04T10:15:00Z'
        }
      ]
    },
    {
      id: 'bedroom',
      title: '寝室',
      category: 'room',
      icon: Bed,
      unreadCount: 0,
      messages: []
    },
    {
      id: 'electrical',
      title: '電気設備',
      category: 'specification',
      icon: Settings,
      unreadCount: 0,
      lastMessage: {
        id: 'msg_elec_001',
        sender: 'contractor',
        senderName: '電気工事担当',
        content: 'コンセントの位置について確認いたします。',
        timestamp: '2024-02-03T14:00:00Z'
      },
      messages: [
        {
          id: 'msg_elec_001',
          sender: 'contractor',
          senderName: '電気工事担当',
          content: 'コンセントの位置について確認いたします。',
          timestamp: '2024-02-03T14:00:00Z'
        }
      ]
    }
  ];

  // サンプルファイルデータ
  const files: ProjectFile[] = [
    {
      id: 'F001',
      name: '基本設計図.pdf',
      type: 'design',
      uploadDate: '2024-02-01',
      size: '2.5MB',
      version: 2,
      uploadedBy: '山田設計士'
    },
    {
      id: 'F002',
      name: '工事契約書.pdf',
      type: 'contract',
      uploadDate: '2024-01-20',
      size: '1.2MB',
      version: 1,
      uploadedBy: '工務店担当者'
    },
    {
      id: 'F003',
      name: '現地写真_外観.jpg',
      type: 'photo',
      uploadDate: '2024-01-16',
      size: '3.8MB',
      version: 1,
      uploadedBy: '工務店担当者'
    }
  ];

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'delayed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'design': return '📐';
      case 'contract': return '📄';
      case 'permit': return '📋';
      case 'photo': return '📷';
      default: return '📁';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThread) {
      // TODO: メッセージ送信処理を実装
      console.log('Sending message:', newMessage, 'to thread:', selectedThread);
      setNewMessage('');
    }
  };

  const renderGanttChart = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">プロジェクトスケジュール</h3>
        
        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* ヘッダー */}
            <div className="grid grid-cols-12 gap-2 mb-4 text-sm font-medium text-gray-500">
              <div className="col-span-3">タスク</div>
              <div className="col-span-2">担当者</div>
              <div className="col-span-2">期間</div>
              <div className="col-span-2">進捗</div>
              <div className="col-span-2">ステータス</div>
              <div className="col-span-1">完了率</div>
            </div>
            
            {/* タスク一覧 */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div key={task.id} className="grid grid-cols-12 gap-2 items-center p-3 bg-gray-50 rounded-lg">
                  <div className="col-span-3">
                    <div className="font-medium text-gray-900">{task.name}</div>
                    <div className="text-sm text-gray-500">#{task.id}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{task.assignee}</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-sm text-gray-700">
                      {formatDate(task.startDate)} - {formatDate(task.endDate)}
                    </div>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                      {task.status === 'completed' && '完了'}
                      {task.status === 'in_progress' && '進行中'}
                      {task.status === 'delayed' && '遅延'}
                      {task.status === 'not_started' && '未開始'}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className="text-sm font-medium text-gray-900">{task.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMessages = () => {
    if (selectedThread) {
      const thread = messageThreads.find(t => t.id === selectedThread);
      if (!thread) return null;

      return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {/* スレッドヘッダー */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSelectedThread(null)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <BackIcon className="h-4 w-4" />
              </button>
              <thread.icon className="h-5 w-5 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">{thread.title}</h3>
            </div>
          </div>

          {/* メッセージ一覧 */}
          <div className="p-4">
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {thread.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'contractor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'contractor'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="text-sm font-medium mb-1">{message.senderName}</div>
                    <div className="text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.sender === 'contractor' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatDateTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* メッセージ入力 */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="メッセージを入力..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // スレッド一覧表示
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">メッセージスレッド</h3>
        
        <div className="space-y-2">
          {/* 案件全体 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">案件全体</h4>
            {messageThreads
              .filter(thread => thread.category === 'general')
              .map((thread) => {
                const Icon = thread.icon;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <div className="font-medium text-gray-900">{thread.title}</div>
                        {thread.lastMessage && (
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {thread.lastMessage.content}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {thread.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                          {thread.unreadCount}
                        </span>
                      )}
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </button>
                );
              })}
          </div>

          {/* 部屋別 */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-500 mb-2">部屋別</h4>
            <div className="space-y-2">
              {messageThreads
                .filter(thread => thread.category === 'room')
                .map((thread) => {
                  const Icon = thread.icon;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{thread.title}</div>
                          {thread.lastMessage && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {thread.lastMessage.content}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {thread.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                            {thread.unreadCount}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          {/* 仕様別 */}
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-2">仕様別</h4>
            <div className="space-y-2">
              {messageThreads
                .filter(thread => thread.category === 'specification')
                .map((thread) => {
                  const Icon = thread.icon;
                  return (
                    <button
                      key={thread.id}
                      onClick={() => setSelectedThread(thread.id)}
                      className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-gray-600" />
                        <div className="text-left">
                          <div className="font-medium text-gray-900">{thread.title}</div>
                          {thread.lastMessage && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {thread.lastMessage.content}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {thread.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                            {thread.unreadCount}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFiles = () => {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">ファイル管理</h3>
          <button className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            ファイルアップロード
          </button>
        </div>
        
        <div className="space-y-3">
          {files.map((file) => (
            <div key={file.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{getFileTypeIcon(file.type)}</div>
                <div>
                  <div className="text-sm font-medium text-gray-900">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {file.size} • v{file.version} • {formatDate(file.uploadDate)} • {file.uploadedBy}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Download className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-y-auto">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/builder-portal')}
                className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                ポータルに戻る
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{project.customerName}</h1>
                <div className="text-sm text-gray-500">#{project.id}</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <Edit className="h-4 w-4 mr-2" />
                編集
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* プロジェクト概要 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">物件所在地</div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{project.propertyAddress}</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">工期</div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">進捗率</div>
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">契約金額</div>
              <div className="text-sm font-medium text-gray-900">
                {new Intl.NumberFormat('ja-JP', {
                  style: 'currency',
                  currency: 'JPY',
                  minimumFractionDigits: 0
                }).format(project.contractAmount)}
              </div>
            </div>
          </div>
        </div>

        {/* タブナビゲーション */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'schedule', label: 'スケジュール', icon: Calendar },
                { id: 'messages', label: 'メッセージ', icon: MessageCircle },
                { id: 'files', label: 'ファイル', icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* タブコンテンツ */}
        {activeTab === 'schedule' && renderGanttChart()}
        {activeTab === 'messages' && renderMessages()}
        {activeTab === 'files' && renderFiles()}
      </div>
    </div>
  );
};

export default ProjectManagement; 