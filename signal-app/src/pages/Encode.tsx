import React, { useState } from 'react';
import { ImageUpload } from '../components/ImageUpload';
import { BinaryVisualization } from '../components/BinaryVisualization';
import { HuffmanCoding } from '../utils/huffman';
import { EnhancedSteganography as Steganography } from '../utils/steganography';
import { Download } from 'lucide-react';
import ReactD3Tree from 'react-d3-tree';
import '../styles/pages/Encode.css';

export function Encode() {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [text, setText] = useState('');
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [encodedBits, setEncodedBits] = useState<string>('');
  const [huffmanTree, setHuffmanTree] = useState<any | null>(null);

  const handleEncode = async () => {
    if (!selectedImage || !text) return;

    setIsEncoding(true);
    try {
      const huffman = new HuffmanCoding();
      const { encodedText, tree } = huffman.encode(text);
      setEncodedBits(encodedText);
      setHuffmanTree(tree);  // Store the Huffman tree

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

  const formatTreeForVisualization = (tree: any) => {
    if (!tree) return null;

    const formatNode = (node: any) => ({
      name: `${node.char || ''}: ${node.freq}`,
      children: node.left || node.right
        ? [
            node.left ? formatNode(node.left) : null,
            node.right ? formatNode(node.right) : null,
          ].filter(Boolean)
        : [],
    });

    return formatNode(tree);
  };

  const treeData = formatTreeForVisualization(huffmanTree);

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

          {encodedBits && (
            <BinaryVisualization 
              originalText={text} 
              encodedBits={encodedBits} 
            />
          )}

          {treeData && (
            <div className="huffman-tree-visualization">
              <h3>Huffman Tree Visualization:</h3>
              <div style={{ width: '100%', height: '500px' }}>
                <ReactD3Tree
                  data={treeData}
                  orientation="vertical"
                  translate={{ x: 400, y: 50 }}
                />
              </div>
            </div>
          )}


          {/* Display initial selected image */}
          {selectedImage && (
            <div className="image-visualization">
              <h3>Original Image:</h3>
              <img
                src={selectedImage.src}
                alt="Original"
                style={{ width: '100%', maxHeight: '500px' }}
              />
            </div>
          )}
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
