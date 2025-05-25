// すごろくアプリのデータ型定義

// フェーズの列挙型
export type Phase = '計画' | '発注' | '設計' | '施工' | '完成・引き渡し';

// 全フェーズの配列
export const ALL_PHASES: Phase[] = [
  '計画',
  '発注',
  '設計',
  '施工',
  '完成・引き渡し'
];

// 画像タイプの列挙型
export type ImageType = 'title' | 'detail' | 'gallery';

// 表示モードの列挙型
export type ViewMode = 'timeline' | 'grid' | 'boardGame' | 'mypage';

// チャットステータスの列挙型
export type ChatStatus = 'active' | 'archived' | 'closed';

// 送信者の役割の列挙型
export type SenderRole = 'customer' | 'builder';

// ステップ画像
export interface StepImage {
  id: number;
  step_id: number;
  image_url: string;
  image_type: ImageType;
  order: number;
}

// ステップグループ
export interface StepGroup {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string | null;
}

// ステップ
export interface Step {
  id: number;
  title: string;
  description: string;
  phase: Phase;
  order_index: number;
  group_id: number;
  created_at: string;
  updated_at: string | null;
  images: StepImage[];
  like_count: number;
}

// ユーザーステップ
export interface UserStep {
  id: number;
  user_id: number;
  step_id: number;
  is_completed: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
  step: Step;
}

// フェーズ進捗
export interface PhaseProgress {
  phase: Phase;
  total_steps: number;
  completed_steps: number;
  progress: number;
}

// いいね
export interface StepLike {
  id: number;
  user_id: number;
  step_id: number;
  created_at: string;
  step?: Step;
}

// チャットメッセージ
export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  sender_role: SenderRole;
  content: string;
  is_read: boolean;
  has_attachment: boolean;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
  created_at: string;
  updated_at: string | null;
}

// チャット一覧アイテム
export interface ChatListItem {
  id: number;
  user_id: number;
  step_id: number;
  builder_id: number | null;
  title: string;
  status: ChatStatus;
  created_at: string;
  updated_at: string | null;
  last_message_at: string | null;
  last_message?: ChatMessage | null;
  unread_count: number;
}

// メッセージ付きチャット
export interface ChatWithMessages extends ChatListItem {
  messages: ChatMessage[];
}

// チャット作成リクエスト
export interface ChatCreateRequest {
  step_id: number;
  title: string;
  builder_id?: number;
}

// メッセージ作成リクエスト
export interface MessageCreateRequest {
  content: string;
  has_attachment?: boolean;
  attachment_url?: string;
  attachment_type?: string;
  attachment_name?: string;
} 