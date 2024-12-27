import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { HuffmanCoding } from '../utils/huffman';
import { Steganography } from '../utils/steganography';
import '../styles/pages/Decode.css';

export function Decode() {
  const [decodedText, setDecodedText] = useState<string>('');
  const [isDecoding, setIsDecoding] = useState(false);

  const handleDecode = async (image: HTMLImageElement) => {
    setIsDecoding(true);
    try {
      const binaryMessage = await Steganography.decodeMessage(image);
      const treeJson = localStorage.getItem('huffmanTree');
      if (!treeJson) {
        throw new Error('Huffman tree not found');
      }
      const tree = JSON.parse(treeJson);
      const huffman = new HuffmanCoding();
      const decoded = huffman.decode(binaryMessage, tree);
      setDecodedText(decoded);
    } catch (error) {
      console.error('Decoding failed:', error);
      setDecodedText('Failed to decode message. Make sure this is an encoded image.');
    }
    setIsDecoding(false);
  };

  return (
    <div className="page">
      <div className="content">
        <h1 className="decode-title">Decode Text from Image</h1>
        <p className="decode-description">
          Extract hidden messages from encoded images
        </p>

        <div className="card">
          <div>
            <label className="form-label">Upload Encoded Image</label>
            <ImageUpload onImageSelect={handleDecode} />
          </div>

          {isDecoding && (
            <div className="loading-text">Decoding message...</div>
          )}

          {decodedText && (
            <div className="decoded-message">
              <h3 className="decoded-title">Decoded Message:</h3>
              <div className="decoded-content">
                <p>{decodedText}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}