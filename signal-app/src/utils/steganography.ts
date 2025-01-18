import { DWT } from './dwt';

export class EnhancedSteganography {
  static readonly BLOCK_SIZE = 8;
  static readonly HEADER_SIZE = 32;
  static readonly BITS_PER_PIXEL = 1;

  private static convertToBinaryArray(messageLength: number): number[] {
    return messageLength.toString(2)
      .padStart(this.HEADER_SIZE, '0')
      .split('')
      .map(bit => parseInt(bit));
  }

  private static embedBitInCoefficient(value: number, bit: number): number {
    // Preserve sign while embedding in least significant bit
    const sign = Math.sign(value);
    const absValue = Math.abs(value);
    return sign * ((Math.floor(absValue / 2) * 2) + bit);
  }

  private static extractBitFromCoefficient(value: number): number {
    return Math.abs(value) & 1;
  }

  private static getNextEmbeddingLocation(index: number, coeffs: any): {
    matrix: 'cA' | 'cH' | 'cV' | 'cD';
    channel: number;
    y: number;
    x: number;
  } {
    // Distribute bits across all coefficient matrices and channels
    const totalCoeffsPerMatrix = coeffs.cA[0].length * coeffs.cA[0][0].length;
    const matrixIndex = Math.floor(index / totalCoeffsPerMatrix) % 4;
    const channel = Math.floor((index / (totalCoeffsPerMatrix * 4))) % 3;
    const position = index % totalCoeffsPerMatrix;
    const y = Math.floor(position / coeffs.cA[0][0].length);
    const x = position % coeffs.cA[0][0].length;

    const matrices: Array<'cA' | 'cH' | 'cV' | 'cD'> = ['cA', 'cH', 'cV', 'cD'];
    return {
      matrix: matrices[matrixIndex],
      channel,
      y,
      x
    };
  }

  static async encodeMessage(
    image: HTMLImageElement,
    binaryMessage: string
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dwtCoeffs = DWT.forward(imageData);

    // Embed header (message length)
    const lengthBits = this.convertToBinaryArray(binaryMessage.length);
    for (let i = 0; i < this.HEADER_SIZE; i++) {
      const { matrix, channel, y, x } = this.getNextEmbeddingLocation(i, dwtCoeffs);
      dwtCoeffs[matrix][channel][y][x] = this.embedBitInCoefficient(
        dwtCoeffs[matrix][channel][y][x],
        lengthBits[i]
      );
    }

    // Embed message bits
    const messageArray = binaryMessage.split('').map(bit => parseInt(bit));
    for (let i = 0; i < messageArray.length; i++) {
      const { matrix, channel, y, x } = this.getNextEmbeddingLocation(
        i + this.HEADER_SIZE,
        dwtCoeffs
      );
      
      if (y < dwtCoeffs[matrix][channel].length && 
          x < dwtCoeffs[matrix][channel][0].length) {
        dwtCoeffs[matrix][channel][y][x] = this.embedBitInCoefficient(
          dwtCoeffs[matrix][channel][y][x],
          messageArray[i]
        );
      }
    }

    // Apply inverse DWT with modified coefficients
    const modifiedImageData = DWT.inverse(dwtCoeffs, image.width, image.height);
    ctx.putImageData(modifiedImageData, 0, 0);

    return canvas.toDataURL();
  }

  static async decodeMessage(image: HTMLImageElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const dwtCoeffs = DWT.forward(imageData);

    // Extract message length
    let lengthBits = '';
    for (let i = 0; i < this.HEADER_SIZE; i++) {
      const { matrix, channel, y, x } = this.getNextEmbeddingLocation(i, dwtCoeffs);
      lengthBits += this.extractBitFromCoefficient(dwtCoeffs[matrix][channel][y][x]);
    }
    const messageLength = parseInt(lengthBits, 2);

    // Extract message bits
    let binaryMessage = '';
    for (let i = 0; i < messageLength; i++) {
      const { matrix, channel, y, x } = this.getNextEmbeddingLocation(
        i + this.HEADER_SIZE,
        dwtCoeffs
      );

      if (y < dwtCoeffs[matrix][channel].length && 
          x < dwtCoeffs[matrix][channel][0].length) {
        binaryMessage += this.extractBitFromCoefficient(
          dwtCoeffs[matrix][channel][y][x]
        );
      }
    }

    return binaryMessage;
  }
}