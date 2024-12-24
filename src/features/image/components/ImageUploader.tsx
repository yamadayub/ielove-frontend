import React from 'react';
import { Upload, X, Plus } from 'lucide-react';
import { UploadedImage } from '../../types';

interface ImageUploaderProps {
  images: UploadedImage[];
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (imageId: string) => void;
  label?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  images = [],
  onUpload,
  onDelete,
  label = '写真を追加'
}) => {
  return (
    <div className="grid grid-cols-3 gap-0.5">
      {images.map((image) => (
        <div key={image.id} className="relative aspect-square">
          <img
            src={image.url}
            alt="Uploaded"
            className="w-full h-full object-cover"
          />
          {image.status === 'uploading' && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}
          <button
            type="button"
            onClick={() => onDelete(image.id)}
            className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
      <label className="relative aspect-square bg-gray-50 cursor-pointer transition-colors hover:bg-gray-100">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={onUpload}
          className="hidden"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <Plus className="h-6 w-6" />
          <span className="text-xs mt-1">{label}</span>
        </div>
      </label>
    </div>
  );
};