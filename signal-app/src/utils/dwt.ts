// dwt.ts
export class DWT {
    static forward(imageData: ImageData): {
      cA: number[][][],
      cH: number[][][],
      cV: number[][][],
      cD: number[][][]
    } {
      const width = imageData.width;
      const height = imageData.height;
      const channels = 3; 
      const data = new Array(channels).fill(0).map(() => 
        new Array(height).fill(0).map(() => 
          new Array(width).fill(0)
        )
      );
      
      // Separate RGB channels
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const idx = (y * width + x) * 4;
          for (let c = 0; c < channels; c++) {
            data[c][y][x] = imageData.data[idx + c];
          }
        }
      }
  
      // Perform 2D Haar wavelet transform on each channel
      const cA = new Array(channels).fill(0).map(() => []);
      const cH = new Array(channels).fill(0).map(() => []);
      const cV = new Array(channels).fill(0).map(() => []);
      const cD = new Array(channels).fill(0).map(() => []);
  
      for (let c = 0; c < channels; c++) {
        for (let y = 0; y < height; y += 2) {
          const rowA: number[] = [];
          const rowH: number[] = [];
          for (let x = 0; x < width; x += 2) {
            const a = data[c][y][x];
            const b = data[c][y][x + 1] || a;
            const c1 = data[c][y + 1]?.[x] || a;
            const d = data[c][y + 1]?.[x + 1] || b;
  
            rowA.push((a + b + c1 + d) / 4);
            rowH.push((a + b - c1 - d) / 4);
          }
          cA[c].push(rowA);
          cH[c].push(rowH);
        }
      }
  
      return { cA, cH, cV, cD };
    }
  
    static inverse(coeffs: {
      cA: number[][][],
      cH: number[][][],
      cV: number[][][],
      cD: number[][][]
    }, originalWidth: number, originalHeight: number): ImageData {
      const result = new ImageData(originalWidth, originalHeight);
      const { cA } = coeffs;
      const channels = cA.length;
  
      for (let y = 0; y < originalHeight; y++) {
        for (let x = 0; x < originalWidth; x++) {
          const idx = (y * originalWidth + x) * 4;
          for (let c = 0; c < channels; c++) {
            const value = Math.max(0, Math.min(255, 
              Math.round(cA[c][Math.floor(y/2)][Math.floor(x/2)])
            ));
            result.data[idx + c] = value;
          }
          result.data[idx + 3] = 255;
        }
      }
  
      return result;
    }
  }