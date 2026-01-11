
import React from 'react';
import { ImageFile } from '../types';

interface PhotoUploaderProps {
  onImagesSelected: (images: ImageFile[]) => void;
}

const PhotoUploader: React.FC<PhotoUploaderProps> = ({ onImagesSelected }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const processedImages: ImageFile[] = await Promise.all(
      files.map((file) => {
        return new Promise<ImageFile>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result as string;
            const base64 = result.split(',')[1];
            resolve({
              id: Math.random().toString(36).substr(2, 9),
              url: URL.createObjectURL(file),
              base64: base64,
              mimeType: file.type,
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );

    onImagesSelected(processedImages);
  };

  return (
    <div className="w-full">
      <label className="block w-full">
        <span className="sr-only">写真を撮る</span>
        <div className="flex items-center justify-center w-full px-6 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-100 transition-all cursor-pointer active:scale-95">
          カメラを起動 / 写真を選択
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          capture="environment"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default PhotoUploader;
