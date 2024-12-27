export class Steganography {
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
    const data = imageData.data;

    // Store message length in first 32 pixels
    const messageLengthBinary = binaryMessage.length.toString(2).padStart(32, '0');
    for (let i = 0; i < 32; i++) {
      data[i * 4] = (data[i * 4] & 254) | parseInt(messageLengthBinary[i]);
    }

    // Encode message
    for (let i = 0; i < binaryMessage.length; i++) {
      const pixelIndex = (i + 32) * 4;
      if (pixelIndex < data.length) {
        data[pixelIndex] = (data[pixelIndex] & 254) | parseInt(binaryMessage[i]);
      }
    }

    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  }

  static async decodeMessage(image: HTMLImageElement): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Read message length
    let messageLengthBinary = '';
    for (let i = 0; i < 32; i++) {
      messageLengthBinary += data[i * 4] & 1;
    }
    const messageLength = parseInt(messageLengthBinary, 2);

    // Read message
    let binaryMessage = '';
    for (let i = 0; i < messageLength; i++) {
      const pixelIndex = (i + 32) * 4;
      if (pixelIndex < data.length) {
        binaryMessage += data[pixelIndex] & 1;
      }
    }

    return binaryMessage;
  }
}