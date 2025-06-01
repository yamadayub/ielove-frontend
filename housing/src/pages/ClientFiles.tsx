import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload,
  Download,
  Eye,
  FileText,
  Image,
  File,
  Calendar,
  User,
  Search,
  Filter,
  Plus,
  Trash2,
  ExternalLink,
  X,
  Camera,
  Home,
  MoreVertical,
  Share
} from 'lucide-react';

interface ProjectFile {
  id: string;
  name: string;
  type: 'design' | 'contract' | 'permit' | 'photo' | 'specification' | 'other';
  uploadDate: string;
  size: string;
  version: number;
  uploadedBy: string;
  uploaderType: 'contractor' | 'customer';
  description?: string;
  category: string;
  isPublic: boolean;
}

const ClientFiles: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('projectId') || 'PRJ001';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFileType, setSelectedFileType] = useState('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // プロジェクト情報
  const project = {
    id: projectId,
    contractorName: '山田工務店',
    propertyAddress: '東京都世田谷区桜丘1-2-3',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    progress: 45
  };

  // ファイルデータ
  const projectFiles: ProjectFile[] = [
    {
      id: 'file_001',
      name: '設計図面_1階平面図.pdf',
      type: 'design',
      uploadDate: '2024-02-08T10:30:00Z',
      size: '2.4 MB',
      version: 2,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '1階の平面図です。最新版に更新しました。',
      category: '設計図面',
      isPublic: true
    },
    {
      id: 'file_002',
      name: '工事契約書.pdf',
      type: 'contract',
      uploadDate: '2024-01-20T14:15:00Z',
      size: '1.8 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '工事請負契約書の正式版です。',
      category: '契約書類',
      isPublic: true
    },
    {
      id: 'file_003',
      name: '建築確認申請書.pdf',
      type: 'permit',
      uploadDate: '2024-01-25T09:45:00Z',
      size: '3.2 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '建築確認申請書の写しです。',
      category: '許可書類',
      isPublic: true
    },
    {
      id: 'file_004',
      name: '基礎工事_完了写真.jpg',
      type: 'photo',
      uploadDate: '2024-02-09T16:20:00Z',
      size: '4.1 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '基礎工事完了時の写真です。',
      category: '工事写真',
      isPublic: true
    },
    {
      id: 'file_005',
      name: 'キッチン仕様書.pdf',
      type: 'specification',
      uploadDate: '2024-02-05T11:30:00Z',
      size: '1.5 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: 'システムキッチンの詳細仕様書です。',
      category: '仕様書',
      isPublic: true
    },
    {
      id: 'file_006',
      name: '要望書_追加工事.docx',
      type: 'other',
      uploadDate: '2024-02-07T13:45:00Z',
      size: '0.8 MB',
      version: 1,
      uploadedBy: '田中太郎',
      uploaderType: 'customer',
      description: '追加工事に関する要望をまとめました。',
      category: 'その他',
      isPublic: true
    },
    {
      id: 'file_007',
      name: '電気設備図.pdf',
      type: 'design',
      uploadDate: '2024-02-06T15:10:00Z',
      size: '2.1 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '電気設備の配線図です。',
      category: '設計図面',
      isPublic: true
    },
    {
      id: 'file_008',
      name: '進捗写真_2024年2月.jpg',
      type: 'photo',
      uploadDate: '2024-02-08T17:30:00Z',
      size: '3.8 MB',
      version: 1,
      uploadedBy: '山田工務店',
      uploaderType: 'contractor',
      description: '2月第2週の工事進捗写真です。',
      category: '工事写真',
      isPublic: true
    }
  ];

  const categories = ['all', '設計図面', '契約書類', '許可書類', '工事写真', '仕様書', 'その他'];
  const fileTypes = ['all', 'design', 'contract', 'permit', 'photo', 'specification', 'other'];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'design':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'contract':
        return <FileText className="h-5 w-5 text-green-600" />;
      case 'permit':
        return <FileText className="h-5 w-5 text-purple-600" />;
      case 'photo':
        return <Image className="h-5 w-5 text-orange-600" />;
      case 'specification':
        return <FileText className="h-5 w-5 text-indigo-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'design': return '設計図面';
      case 'contract': return '契約書類';
      case 'permit': return '許可書類';
      case 'photo': return '工事写真';
      case 'specification': return '仕様書';
      default: return 'その他';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredFiles = projectFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    const matchesType = selectedFileType === 'all' || file.type === selectedFileType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (file: ProjectFile) => {
    // TODO: ファイルダウンロード処理を実装
    console.log('Downloading file:', file.name);
    alert(`${file.name} をダウンロードします`);
  };

  const handlePreview = (file: ProjectFile) => {
    // TODO: ファイルプレビュー処理を実装
    console.log('Previewing file:', file.name);
    alert(`${file.name} をプレビューします`);
  };

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const UploadModal = () => {
    const [uploadFile, setUploadFile] = useState<File | null>(null);
    const [uploadDescription, setUploadDescription] = useState('');
    const [uploadCategory, setUploadCategory] = useState('その他');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setUploadFile(e.target.files[0]);
      }
    };

    const handleSubmitUpload = () => {
      if (uploadFile) {
        // TODO: ファイルアップロード処理を実装
        console.log('Uploading file:', uploadFile.name, uploadDescription, uploadCategory);
        alert(`${uploadFile.name} をアップロードしました`);
        setShowUploadModal(false);
        setUploadFile(null);
        setUploadDescription('');
        setUploadCategory('その他');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">ファイルアップロード</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ファイル選択
              </label>
              <input
                type="file"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                カテゴリ
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                説明（任意）
              </label>
              <textarea
                value={uploadDescription}
                onChange={(e) => setUploadDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ファイルの説明を入力してください"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowUploadModal(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSubmitUpload}
              disabled={!uploadFile}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              アップロード
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FilterModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50 sm:items-center">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md mx-4 sm:mx-0 max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">フィルター</h3>
            <button
              onClick={() => setShowFilterModal(false)}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-6">
          {/* カテゴリフィルター */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">カテゴリ</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'すべて' },
                { value: '設計図面', label: '設計図面' },
                { value: '契約書類', label: '契約書類' },
                { value: '許可申請', label: '許可申請' },
                { value: '工事写真', label: '工事写真' },
                { value: '仕様書', label: '仕様書' }
              ].map((category) => (
                <label key={category.value} className="flex items-center">
                  <input
                    type="radio"
                    name="category"
                    value={category.value}
                    checked={selectedCategory === category.value}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{category.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ファイル形式フィルター */}
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">ファイル形式</h4>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'すべて' },
                { value: 'design', label: '設計図面' },
                { value: 'photo', label: '写真' },
                { value: 'contract', label: '契約書' },
                { value: 'specification', label: '仕様書' }
              ].map((type) => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="radio"
                    name="fileType"
                    value={type.value}
                    checked={selectedFileType === type.value}
                    onChange={(e) => setSelectedFileType(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => setShowFilterModal(false)}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            適用
          </button>
        </div>
      </div>
    </div>
  );

  // サンプルプロジェクト情報
  const sampleProject = {
    id: projectId,
    name: '世田谷区桜丘の戸建てリノベーション',
    contractorName: '山田工務店',
    totalFiles: projectFiles.length
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">ファイル管理</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center gap-2">
            {/* 検索ボックス */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                placeholder="ファイル名を検索"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* フィルターボタン */}
            <button
              onClick={() => setShowFilterModal(true)}
              className="p-2 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-50 flex-shrink-0"
              title="フィルター"
            >
              <Filter className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* ファイル一覧 */}
        <div className="bg-white rounded-lg shadow-sm border">
          {filteredFiles.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">ファイルが見つかりません</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <div key={file.id} className="p-3 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    {/* ファイルアイコン */}
                    <div className="flex-shrink-0 mt-1">
                      {getFileTypeIcon(file.type)}
                    </div>

                    {/* ファイル情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                          {file.name}
                        </h3>
                        
                        {/* アクションボタン */}
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <button
                            onClick={() => handlePreview(file)}
                            className="p-2 flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="プレビュー"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDownload(file)}
                            className="p-2 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="ダウンロード"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {/* ファイル詳細 */}
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                        <span>{file.size}</span>
                        <span>{formatDate(file.uploadDate)}</span>
                        <span>{file.uploadedBy}</span>
                        {file.version > 1 && (
                          <span className="text-blue-600 font-medium">v{file.version}</span>
                        )}
                      </div>
                      
                      {/* コメント */}
                      {file.description && (
                        <p className="text-xs text-gray-600 mt-1 text-left line-clamp-1">
                          {file.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* アップロードボタン */}
        <div className="mt-6 text-center">
          <button
            onClick={handleUpload}
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            <Upload className="h-5 w-5 mr-2" />
            ファイルをアップロード
          </button>
        </div>
      </div>

      {/* フィルターモーダル */}
      {showFilterModal && <FilterModal />}

      {/* アップロードモーダル */}
      {showUploadModal && <UploadModal />}
    </div>
  );
};

export default ClientFiles; 