import { Candle } from './supportResistance';

/**
 * Tinh ATR (Average True Range) chuan - do bien dong thuc te cua coin,
 * dung de tinh TP/SL theo bien dong that thay vi % co dinh tuy tien.
 */
export function computeATR(candles: Candle[], period = 14): number | null {
  if (candles.length < period + 1) return null;

  const trueRanges: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    const curr = candles[i];
    const prev = candles[i - 1];
    const tr = Math.max(
      curr.high - curr.low,
      Math.abs(curr.high - prev.close),
      Math.abs(curr.low - prev.close)
    );
    if (Number.isFinite(tr)) trueRanges.push(tr);
  }

  if (trueRanges.length < period) return null;
  const recent = trueRanges.slice(-period);
  return recent.reduce((a, b) => a + b, 0) / recent.length;
}
