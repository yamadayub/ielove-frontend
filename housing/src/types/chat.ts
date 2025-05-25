export interface ChatRoom {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  type: 'general' | 'contractor' | 'design_review';
  participants: ChatParticipant[];
  created_at: string;
  updated_at: string;
  last_message?: ChatMessage;
}

export interface ChatParticipant {
  user_id: string;
  username: string;
  avatar_url?: string;
  role: 'owner' | 'contractor' | 'designer' | 'viewer';
  joined_at: string;
  is_online: boolean;
}

export interface ChatMessage {
  id: string;
  room_id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  attachments?: ChatAttachment[];
  reply_to?: string;
  created_at: string;
  updated_at?: string;
  is_edited: boolean;
}

export interface ChatAttachment {
  id: string;
  filename: string;
  file_url: string;
  file_type: string;
  file_size: number;
  thumbnail_url?: string;
}

export interface SendMessageRequest {
  room_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file';
  attachments?: File[];
  reply_to?: string;
}

export interface CreateChatRoomRequest {
  project_id: string;
  name: string;
  description?: string;
  type: 'general' | 'contractor' | 'design_review';
  participant_ids?: string[];
} 