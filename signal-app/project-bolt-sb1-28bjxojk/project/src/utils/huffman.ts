// Huffman coding implementation
class HuffmanNode {
  char: string;
  freq: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string, freq: number) {
    this.char = char;
    this.freq = freq;
    this.left = null;
    this.right = null;
  }
}

export class HuffmanCoding {
  private buildHuffmanTree(text: string): HuffmanNode {
    const freqMap = new Map<string, number>();
    for (const char of text) {
      freqMap.set(char, (freqMap.get(char) || 0) + 1);
    }

    const nodes = Array.from(freqMap.entries()).map(
      ([char, freq]) => new HuffmanNode(char, freq)
    );

    while (nodes.length > 1) {
      nodes.sort((a, b) => b.freq - a.freq);
      const right = nodes.pop()!;
      const left = nodes.pop()!;
      const parent = new HuffmanNode('', left.freq + right.freq);
      parent.left = left;
      parent.right = right;
      nodes.push(parent);
    }

    return nodes[0];
  }

  private buildEncodingMap(
    root: HuffmanNode,
    code = '',
    map = new Map<string, string>()
  ): Map<string, string> {
    if (!root) return map;
    if (!root.left && !root.right) {
      map.set(root.char, code || '0');
    }
    if (root.left) this.buildEncodingMap(root.left, code + '0', map);
    if (root.right) this.buildEncodingMap(root.right, code + '1', map);
    return map;
  }

  encode(text: string): { encodedText: string; tree: HuffmanNode } {
    const tree = this.buildHuffmanTree(text);
    const encodingMap = this.buildEncodingMap(tree, '');
    const encodedText = text
      .split('')
      .map((char) => encodingMap.get(char))
      .join('');
    return { encodedText, tree };
  }

  decode(encodedText: string, tree: HuffmanNode): string {
    let current = tree;
    let result = '';

    for (const bit of encodedText) {
      if (!current) break;
      
      if (bit === '0') {
        current = current.left!;
      } else {
        current = current.right!;
      }

      if (!current.left && !current.right) {
        result += current.char;
        current = tree;
      }
    }

    return result;
  }
}