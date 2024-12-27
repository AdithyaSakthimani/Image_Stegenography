import React from 'react';
import { Upload } from 'lucide-react';
import '../styles/components/ImageUpload.css';

interface ImageUploadProps {
  onImageSelect: (image: HTMLImageElement) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => onImageSelect(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="upload-container">
      <label className="upload-area">
        <div>
          <Upload className="upload-icon" />
          <p className="upload-text">
            <span className="upload-text-bold">Click to upload</span> or drag and drop
          </p>
          <p className="upload-text">PNG, JPG or GIF</p>
        </div>
        <input
          type="file"
          className="upload-input"
          accept="image/*"
          onChange={handleImageUpload}
        />
      </label>
    </div>
  );
}