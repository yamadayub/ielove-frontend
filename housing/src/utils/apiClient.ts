import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Project, CreateProjectRequest, UpdateProjectRequest } from '../types/project';
import { Material, MaterialLibrary } from '../types/materials';
import { ChatRoom, ChatMessage, SendMessageRequest, CreateChatRoomRequest } from '../types/chat';

class HousingApiClient {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor for auth
    this.api.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('clerk-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Project API
  async getProjects(): Promise<Project[]> {
    const response: AxiosResponse<Project[]> = await this.api.get('/housing/projects/');
    return response.data;
  }

  async getProject(id: string): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.get(`/housing/projects/${id}/`);
    return response.data;
  }

  async createProject(data: CreateProjectRequest): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.post('/housing/projects/', data);
    return response.data;
  }

  async updateProject(id: string, data: UpdateProjectRequest): Promise<Project> {
    const response: AxiosResponse<Project> = await this.api.patch(`/housing/projects/${id}/`, data);
    return response.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.api.delete(`/housing/projects/${id}/`);
  }

  // Materials API
  async getMaterials(): Promise<MaterialLibrary> {
    const response: AxiosResponse<MaterialLibrary> = await this.api.get('/housing/materials/');
    return response.data;
  }

  async getMaterial(id: string): Promise<Material> {
    const response: AxiosResponse<Material> = await this.api.get(`/housing/materials/${id}/`);
    return response.data;
  }

  async getMaterialsByCategory(category: string): Promise<Material[]> {
    const response: AxiosResponse<Material[]> = await this.api.get(`/housing/materials/category/${category}/`);
    return response.data;
  }

  // Chat API
  async getChatRooms(projectId: string): Promise<ChatRoom[]> {
    const response: AxiosResponse<ChatRoom[]> = await this.api.get(`/housing/chat/rooms/?project_id=${projectId}`);
    return response.data;
  }

  async getChatRoom(roomId: string): Promise<ChatRoom> {
    const response: AxiosResponse<ChatRoom> = await this.api.get(`/housing/chat/rooms/${roomId}/`);
    return response.data;
  }

  async createChatRoom(data: CreateChatRoomRequest): Promise<ChatRoom> {
    const response: AxiosResponse<ChatRoom> = await this.api.post('/housing/chat/rooms/', data);
    return response.data;
  }

  async getChatMessages(roomId: string, page: number = 1, limit: number = 50): Promise<ChatMessage[]> {
    const response: AxiosResponse<ChatMessage[]> = await this.api.get(
      `/housing/chat/rooms/${roomId}/messages/?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async sendMessage(data: SendMessageRequest): Promise<ChatMessage> {
    const formData = new FormData();
    formData.append('room_id', data.room_id);
    formData.append('content', data.content);
    if (data.message_type) {
      formData.append('message_type', data.message_type);
    }
    if (data.reply_to) {
      formData.append('reply_to', data.reply_to);
    }
    if (data.attachments) {
      data.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
    }

    const response: AxiosResponse<ChatMessage> = await this.api.post(
      '/housing/chat/messages/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  }

  // Documents API
  async uploadDocument(projectId: string, file: File, category?: string): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('project_id', projectId);
    if (category) {
      formData.append('category', category);
    }

    const response = await this.api.post('/housing/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getDocuments(projectId: string): Promise<any[]> {
    const response = await this.api.get(`/housing/documents/?project_id=${projectId}`);
    return response.data;
  }

  async deleteDocument(documentId: string): Promise<void> {
    await this.api.delete(`/housing/documents/${documentId}/`);
  }
}

// Singleton instance
export const housingApiClient = new HousingApiClient();
export default housingApiClient; 