import React from 'react';
import '../styles/components/BinaryVisualization.css';

interface BinaryVisualizationProps {
  originalText: string;
  encodedBits: string;
}

export function BinaryVisualization({ originalText, encodedBits }: BinaryVisualizationProps) {
  return (
    <div className="binary-container">
      <div className="binary-section">
        <h4 className="binary-title">Original Text (ASCII):</h4>
        <div className="binary-grid">
          {originalText.split('').map((char, i) => (
            <div key={i} className="binary-cell">
              <span className="binary-char">{char}</span>
              <span className="binary-bits">
                {char.charCodeAt(0).toString(2).padStart(8, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="binary-section">
        <h4 className="binary-title">Huffman Encoded:</h4>
        <div className="binary-stream">
          {encodedBits.split('').map((bit, i) => (
            <span key={i} className={`bit ${bit === '1' ? 'bit-one' : 'bit-zero'}`}>
              {bit}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}