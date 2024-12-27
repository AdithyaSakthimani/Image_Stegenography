import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { HuffmanCoding } from '../utils/huffman';
import { EnhancedSteganography as Steganography } from '../utils/steganography';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import '../styles/pages/Decode.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Decode() {
  const [decodedText, setDecodedText] = useState<string>('');
  const [isDecoding, setIsDecoding] = useState(false);
  const [bStream, setBstream] = useState('');

  const handleDecode = async (image: HTMLImageElement) => {
    setIsDecoding(true);
    try {
      const binaryMessage = await Steganography.decodeMessage(image);
      setBstream(binaryMessage);
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

  const bitstreamData = {
    labels: [...bStream].map((_, idx) => `Bit ${idx + 1}`),
    datasets: [
      {
        label: 'Bitstream',
        data: [...bStream].map((bit) => parseInt(bit, 10)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
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

          {isDecoding && <div className="loading-text">Decoding message...</div>}

          {decodedText && (
            <div>
              <div className="decoded-message">
                <h3 className="decoded-title">Bit Stream</h3>
                <div className="decoded-content">
                  <Bar data={bitstreamData} />
                </div>
              </div>
              <div className="decoded-message">
                <h3 className="decoded-title">Decoded Message:</h3>
                <div className="decoded-content">
                  <p>{decodedText}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
