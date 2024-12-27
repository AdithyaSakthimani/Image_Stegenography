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

  private static embedBitInPixel(value: number, bit: number): number {
    return (Math.floor(value / 2) * 2) + bit;
  }

  private static extractBitFromPixel(value: number): number {
    return value & 1;
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


    const lengthBits = this.convertToBinaryArray(binaryMessage.length);
    for (let i = 0; i < this.HEADER_SIZE; i++) {
      const y = Math.floor(i / dwtCoeffs.cA[0][0].length);
      const x = i % dwtCoeffs.cA[0][0].length;
      dwtCoeffs.cA[2][y][x] = this.embedBitInPixel(dwtCoeffs.cA[2][y][x], lengthBits[i]);
    }

    // Embed message bits
    const messageArray = binaryMessage.split('').map(bit => parseInt(bit));
    let messageIndex = 0;

    // Use simple LSB in blue channel coefficients after header
    for (let i = this.HEADER_SIZE; i < this.HEADER_SIZE + messageArray.length; i++) {
      const y = Math.floor(i / dwtCoeffs.cA[0][0].length);
      const x = i % dwtCoeffs.cA[0][0].length;
      
      if (y < dwtCoeffs.cA[2].length && x < dwtCoeffs.cA[2][0].length) {
        dwtCoeffs.cA[2][y][x] = this.embedBitInPixel(
          dwtCoeffs.cA[2][y][x],
          messageArray[messageIndex++]
        );
      }
    }

    // Apply inverse DWT
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
      const y = Math.floor(i / dwtCoeffs.cA[0][0].length);
      const x = i % dwtCoeffs.cA[0][0].length;
      lengthBits += this.extractBitFromPixel(dwtCoeffs.cA[2][y][x]);
    }
    const messageLength = parseInt(lengthBits, 2);

    // Extract message bits
    let binaryMessage = '';
    for (let i = this.HEADER_SIZE; i < this.HEADER_SIZE + messageLength; i++) {
      const y = Math.floor(i / dwtCoeffs.cA[0][0].length);
      const x = i % dwtCoeffs.cA[0][0].length;
      
      if (y < dwtCoeffs.cA[2].length && x < dwtCoeffs.cA[2][0].length) {
        binaryMessage += this.extractBitFromPixel(dwtCoeffs.cA[2][y][x]);
      }
    }

    return binaryMessage;
  }
}