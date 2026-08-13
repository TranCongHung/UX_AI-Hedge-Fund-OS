export interface Candle {
  open_time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Level {
  price: number;
  strength: number; // so lan gia cham vao vung nay - cang cao cang manh
}

/**
 * Tim cac diem swing high/low (dinh/day cuc bo) bang cach so sanh
 * moi nen voi `lookback` nen truoc va sau no.
 */
function findSwingPoints(candles: Candle[], lookback = 3) {
  const swingHighs: number[] = [];
  const swingLows: number[] = [];

  for (let i = lookback; i < candles.length - lookback; i++) {
    const windowSlice = candles.slice(i - lookback, i + lookback + 1);
    const maxHigh = Math.max(...windowSlice.map((c) => c.high));
    const minLow = Math.min(...windowSlice.map((c) => c.low));

    if (candles[i].high === maxHigh) swingHighs.push(candles[i].high);
    if (candles[i].low === minLow) swingLows.push(candles[i].low);
  }

  return { swingHighs, swingLows };
}

/**
 * Gom nhom cac muc gia gan nhau (trong pham vi tolerancePct) thanh 1 "vung"
 * duy nhat, tinh do manh (strength) theo so lan gia cham vao vung do.
 */
function clusterLevels(levels: number[], tolerancePct = 0.006): Level[] {
  if (levels.length === 0) return [];
  const sorted = [...levels].sort((a, b) => a - b);
  const clusters: number[][] = [];
  let current: number[] = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = current[current.length - 1];
    if ((sorted[i] - last) / last <= tolerancePct) {
      current.push(sorted[i]);
    } else {
      clusters.push(current);
      current = [sorted[i]];
    }
  }
  clusters.push(current);

  return clusters
    .map((c) => ({
      price: c.reduce((a, b) => a + b, 0) / c.length,
      strength: c.length,
    }))
    .sort((a, b) => b.strength - a.strength);
}

/**
 * Tinh vung Ho tro (support) va Khang cu (resistance) tu du lieu nen that.
 * Day la thuat toan don gian dua tren swing high/low - KHONG phai phan tich
 * chuyen sau, chi mang tinh tham khao truc quan.
 */
export function computeSupportResistance(candles: Candle[], maxLevels = 2) {
  const { swingHighs, swingLows } = findSwingPoints(candles, 3);
  const resistance = clusterLevels(swingHighs).slice(0, maxLevels);
  const support = clusterLevels(swingLows).slice(0, maxLevels);
  return { support, resistance };
}
