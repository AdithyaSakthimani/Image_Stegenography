import React, { useState, DragEvent } from 'react';
import { Upload } from 'lucide-react';
import '../styles/components/ImageUpload.css';

interface ImageUploadProps {
  onImageSelect: (image: HTMLImageElement) => void;
}

export function ImageUpload({ onImageSelect }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const[isFilePresent , setIsFilePresent] = useState(false);
  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => onImageSelect(img);
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log(file) ; 
    if(file){
      setIsFilePresent(true);
    }
    if (file) {
      handleFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    console.log(file);
    if(file){
      setIsFilePresent(true);
    }
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div className="upload-container">
      <label 
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div>
          <Upload className="upload-icon" />
          <p className="upload-text">
            <span className="upload-text-bold">{isFilePresent? 'Image Uploaded ' : 'Click to upload or drag and drop'}
            </span>
          </p>
          {!isFilePresent && <p className="upload-text">PNG, JPG or GIF</p>}
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