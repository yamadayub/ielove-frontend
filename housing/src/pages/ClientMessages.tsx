import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send,
  MessageSquare,
  Home,
  ChefHat,
  Bath,
  Bed,
  Sofa,
  Settings,
  ArrowLeft as BackIcon,
  ChevronRight,
  Bell,
  Clock,
  User,
  Wrench,
  FileText,
  Phone,
  Video
} from 'lucide-react';

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

const ClientMessages: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'PRJ001';
  
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // サンプルプロジェクト情報
  const sampleProject = {
    id: projectId,
    contractorName: '山田工務店',
    name: '山田工務店のプロジェクト',
    unreadMessages: 1
  };

  // メッセージスレッドデータ（工務店側と同じ構造）
  const messageThreads: MessageThread[] = [
    {
      id: 'general',
      title: '案件全体',
      category: 'general',
      icon: Home,
      unreadCount: 1,
      lastMessage: {
        id: 'msg_gen_004',
        sender: 'contractor',
        senderName: '山田工務店',
        content: '基礎工事が完了いたしました。写真をお送りします。',
        timestamp: '2024-02-09T10:00:00Z'
      },
      messages: [
        {
          id: 'msg_gen_001',
          sender: 'contractor',
          senderName: '山田工務店',
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
        },
        {
          id: 'msg_gen_004',
          sender: 'contractor',
          senderName: '山田工務店',
          content: '基礎工事が完了いたしました。写真をお送りします。',
          timestamp: '2024-02-09T10:00:00Z'
        }
      ]
    },
    {
      id: 'kitchen',
      title: 'キッチン',
      category: 'room',
      icon: ChefHat,
      unreadCount: 0,
      lastMessage: {
        id: 'msg_kit_003',
        sender: 'contractor',
        senderName: '山田工務店',
        content: 'IHコンロの色変更について確認いたします。追加費用は発生いたしません。',
        timestamp: '2024-02-08T09:15:00Z'
      },
      messages: [
        {
          id: 'msg_kit_001',
          sender: 'contractor',
          senderName: '山田工務店',
          content: 'キッチンの仕様について確認させていただきます。',
          timestamp: '2024-02-05T11:00:00Z'
        },
        {
          id: 'msg_kit_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: 'IHコンロの色を変更したいのですが可能でしょうか？',
          timestamp: '2024-02-07T16:45:00Z'
        },
        {
          id: 'msg_kit_003',
          sender: 'contractor',
          senderName: '山田工務店',
          content: 'IHコンロの色変更について確認いたします。追加費用は発生いたしません。',
          timestamp: '2024-02-08T09:15:00Z'
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
        id: 'msg_liv_002',
        sender: 'customer',
        senderName: '田中太郎',
        content: 'ありがとうございます。楽しみにしています。',
        timestamp: '2024-02-06T14:30:00Z'
      },
      messages: [
        {
          id: 'msg_liv_001',
          sender: 'contractor',
          senderName: '山田工務店',
          content: 'フローリングの色見本をお持ちします。',
          timestamp: '2024-02-06T13:20:00Z'
        },
        {
          id: 'msg_liv_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: 'ありがとうございます。楽しみにしています。',
          timestamp: '2024-02-06T14:30:00Z'
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
        id: 'msg_bath_002',
        sender: 'customer',
        senderName: '田中太郎',
        content: '仕様書を確認いたします。ありがとうございます。',
        timestamp: '2024-02-04T11:00:00Z'
      },
      messages: [
        {
          id: 'msg_bath_001',
          sender: 'contractor',
          senderName: '山田工務店',
          content: 'ユニットバスの仕様書をお送りします。',
          timestamp: '2024-02-04T10:15:00Z'
        },
        {
          id: 'msg_bath_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: '仕様書を確認いたします。ありがとうございます。',
          timestamp: '2024-02-04T11:00:00Z'
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
        id: 'msg_elec_002',
        sender: 'customer',
        senderName: '田中太郎',
        content: 'コンセントの位置について相談があります。',
        timestamp: '2024-02-03T15:30:00Z'
      },
      messages: [
        {
          id: 'msg_elec_001',
          sender: 'contractor',
          senderName: '山田工務店',
          content: 'コンセントの位置について確認いたします。',
          timestamp: '2024-02-03T14:00:00Z'
        },
        {
          id: 'msg_elec_002',
          sender: 'customer',
          senderName: '田中太郎',
          content: 'コンセントの位置について相談があります。',
          timestamp: '2024-02-03T15:30:00Z'
        }
      ]
    }
  ];

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedThread) {
      // TODO: メッセージ送信処理を実装
      console.log('Sending message:', newMessage, 'to thread:', selectedThread);
      setNewMessage('');
    }
  };

  const renderMessages = () => {
    // スレッドが選択されていない場合はスレッド一覧を表示
    if (!selectedThread) {
      return (
        <div className="flex flex-col h-full">
          {/* ヘッダー */}
          <div className="bg-white shadow-sm border-b">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14 sm:h-16">
                <div className="flex items-center min-w-0">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center text-gray-600 hover:text-gray-900 mr-3 sm:mr-4 flex-shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                    <span className="hidden sm:inline">戻る</span>
                  </button>
                  <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">メッセージ</h1>
                </div>
              </div>
            </div>
          </div>

          {/* メッセージスレッド一覧 */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-6">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-4">
                メッセージカテゴリ
              </h3>
            </div>
            <div className="space-y-2 px-4">
              {messageThreads.map((thread) => {
                const IconComponent = thread.icon;
                return (
                  <button
                    key={thread.id}
                    onClick={() => setSelectedThread(thread.id)}
                    className="w-full flex items-center p-4 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors bg-white border border-gray-200"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                      thread.category === 'general' ? 'bg-blue-100' :
                      thread.category === 'room' ? 'bg-green-100' : 'bg-purple-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        thread.category === 'general' ? 'text-blue-600' :
                        thread.category === 'room' ? 'text-green-600' : 'text-purple-600'
                      }`} />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-base font-medium text-gray-900 truncate">
                          {thread.title}
                        </h4>
                        {thread.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2 flex-shrink-0">
                            {thread.unreadCount}
                          </span>
                        )}
                      </div>
                      {thread.lastMessage && (
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 truncate">
                            {thread.lastMessage.content}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{thread.lastMessage.senderName}</span>
                            <span>•</span>
                            <span>{formatDate(thread.lastMessage.timestamp)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 個別スレッド表示（モバイルファースト）
    const currentThread = messageThreads.find(t => t.id === selectedThread);
    if (!currentThread) return null;

    const IconComponent = currentThread.icon;

    return (
      <div className="flex flex-col h-full">
        {/* スレッドヘッダー */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedThread(null)}
              className="flex items-center text-gray-600 hover:text-gray-900 mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
              currentThread.category === 'general' ? 'bg-blue-100' :
              currentThread.category === 'room' ? 'bg-green-100' : 'bg-purple-100'
            }`}>
              <IconComponent className={`h-4 w-4 ${
                currentThread.category === 'general' ? 'text-blue-600' :
                currentThread.category === 'room' ? 'text-green-600' : 'text-purple-600'
              }`} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-gray-900 truncate">
                {currentThread.title}
              </h2>
              <p className="text-xs text-gray-500">
                {currentThread.messages.length}件のメッセージ
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <Phone className="h-4 w-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100">
                <Video className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* メッセージ一覧 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentThread.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs sm:max-w-sm lg:max-w-md ${
                message.sender === 'customer' ? 'order-2' : 'order-1'
              }`}>
                <div className={`rounded-2xl px-4 py-3 ${
                  message.sender === 'customer'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className={`flex items-center mt-1 space-x-2 ${
                  message.sender === 'customer' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500">{message.senderName}</span>
                  <span className="text-xs text-gray-400">
                    {formatDateTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* メッセージ入力エリア */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={1}
                style={{ minHeight: '44px', maxHeight: '120px' }}
                onInput={(e) => {
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="w-11 h-11 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {renderMessages()}
    </div>
  );
};

export default ClientMessages; 