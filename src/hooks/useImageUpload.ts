import { useState, useCallback } from 'react';
import axios from '../axios';
import { UploadedImage } from '../types';

export const useImageUpload = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    const newImages = Array.from(files).map(file => ({
      id: URL.createObjectURL(file),
      url: URL.createObjectURL(file),
      status: 'uploading' as const
    }));
    
    setImages(prev => [...prev, ...newImages]);

    try {
      const uploadPromises = Array.from(files).map(async (file, index) => {
        try {
          // FormDataを使用してファイルをアップロード
          const formData = new FormData();
          formData.append('file', file);

          const response = await axios.post('/api/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });

          const uploadedImage = {
            id: response.data.id,
            url: response.data.url,
            status: 'completed' as const
          };

          setImages(prev => 
            prev.map(img => 
              img.url === newImages[index].url ? uploadedImage : img
            )
          );

          return uploadedImage;
        } catch (error) {
          setImages(prev => 
            prev.map(img => 
              img.url === newImages[index].url 
                ? { ...img, status: 'error' as const }
                : img
            )
          );
          throw error;
        }
      });

      await Promise.allSettled(uploadPromises);
    } catch (error) {
      console.error('Some uploads failed:', error);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const deleteImage = useCallback(async (imageId: string) => {
    try {
      if (imageId.startsWith('blob:')) {
        URL.revokeObjectURL(imageId);
      } else {
        await axios.delete(`/api/images/${imageId}`);
      }
      setImages(prev => prev.filter(img => img.id !== imageId));
    } catch (error) {
      console.error('Image deletion failed:', error);
    }
  }, []);

  return {
    images,
    isUploading,
    handleUpload,
    deleteImage,
    setImages // 初期画像を設定するために追加
  };
};