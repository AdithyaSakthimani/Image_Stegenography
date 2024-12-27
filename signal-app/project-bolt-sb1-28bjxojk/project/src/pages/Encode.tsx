import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { HuffmanCoding } from '../utils/huffman';
import { Steganography } from '../utils/steganography';
import { Download } from 'lucide-react';
import '../styles/pages/Encode.css';

export function Encode() {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState('');
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);

  const handleEncode = async () => {
    if (!selectedImage || !text) return;

    setIsEncoding(true);
    try {
      const huffman = new HuffmanCoding();
      const { encodedText, tree } = huffman.encode(text);
      localStorage.setItem('huffmanTree', JSON.stringify(tree));
      const encodedImageData = await Steganography.encodeMessage(
        selectedImage,
        encodedText
      );
      setEncodedImage(encodedImageData);
    } catch (error) {
      console.error('Encoding failed:', error);
    }
    setIsEncoding(false);
  };

  return (
    <div className="page">
      <div className="content">
        <h1 className="encode-title">Encode Text into Image</h1>
        <p className="encode-description">
          Hide your message within an image using Huffman coding and steganography
        </p>

        <div className="card">
          <div>
            <label className="form-label">Upload Image</label>
            <ImageUpload onImageSelect={setSelectedImage} />
          </div>

          <div>
            <label className="form-label">Enter Text</label>
            <textarea
              className="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the text you want to hide..."
            />
          </div>

          <button
            onClick={handleEncode}
            disabled={!selectedImage || !text || isEncoding}
            className="btn btn-primary"
          >
            {isEncoding ? 'Encoding...' : 'Encode Message'}
          </button>

          {encodedImage && (
            <div className="result-section">
              <h3 className="result-title">Encoded Image:</h3>
              <div style={{ position: 'relative' }}>
                <img
                  src={encodedImage}
                  alt="Encoded"
                  className="result-image"
                />
                <a
                  href={encodedImage}
                  download="encoded-image.png"
                  className="download-button"
                >
                  <Download className="w-5 h-5" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}