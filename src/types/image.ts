export interface UploadedImage {
  id: string;
  url: string;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}