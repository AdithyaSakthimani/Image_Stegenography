export class DCT {
  static forward(block: number[][]): number[][] {
    const N = block.length;
    const result = Array(N).fill(0).map(() => Array(N).fill(0));

    for (let u = 0; u < N; u++) {
      for (let v = 0; v < N; v++) {
        let sum = 0;
        for (let x = 0; x < N; x++) {
          for (let y = 0; y < N; y++) {
            sum += block[x][y] *
              Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N)) *
              Math.cos(((2 * y + 1) * v * Math.PI) / (2 * N));
          }
        }
        const cu = u === 0 ? 1/Math.sqrt(2) : 1;
        const cv = v === 0 ? 1/Math.sqrt(2) : 1;
        result[u][v] = (2 * cu * cv * sum) / N;
      }
    }
    return result;
  }

  static inverse(block: number[][]): number[][] {
    const N = block.length;
    const result = Array(N).fill(0).map(() => Array(N).fill(0));

    for (let x = 0; x < N; x++) {
      for (let y = 0; y < N; y++) {
        let sum = 0;
        for (let u = 0; u < N; u++) {
          for (let v = 0; v < N; v++) {
            const cu = u === 0 ? 1/Math.sqrt(2) : 1;
            const cv = v === 0 ? 1/Math.sqrt(2) : 1;
            sum += cu * cv * block[u][v] *
              Math.cos(((2 * x + 1) * u * Math.PI) / (2 * N)) *
              Math.cos(((2 * y + 1) * v * Math.PI) / (2 * N));
          }
        }
        result[x][y] = Math.round((2 * sum) / N);
      }
    }
    return result;
  }
}