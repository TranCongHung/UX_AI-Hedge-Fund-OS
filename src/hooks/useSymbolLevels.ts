import { useEffect, useState } from 'react';
import { fetchDashboardCandles } from '@/lib/api';
import { computeATR } from '@/lib/atr';
import { Candle } from '@/lib/supportResistance';

export interface SymbolLevels {
  side: 'LONG' | 'SHORT' | 'HOLD';
  entry: number | null;
  tp: number | null;
  sl: number | null;
  atr: number | null;
  leverage: number;
  loading: boolean;
  error: string | null;
}

function suggestLeverage(riskLevel: string | null) {
  if (riskLevel === 'HIGH') return 2;
  if (riskLevel === 'MEDIUM') return 5;
  return 10; // LOW hoac khong ro
}

// He so nhan ATR de tinh TP/SL - risk cao thi TP/SL gan hon (chac an hon),
// risk thap thi TP/SL xa hon (bien do rong hon vi coin on dinh hon).
function atrMultipliers(riskLevel: string | null) {
  if (riskLevel === 'HIGH') return { tpMult: 1.5, slMult: 1.0 };
  if (riskLevel === 'MEDIUM') return { tpMult: 2.5, slMult: 1.5 };
  return { tpMult: 3.5, slMult: 2.0 };
}

/**
 * Fetch nen moi nhat, tinh Entry = gia dong cua gan nhat (LUON TUOI, khong dung
 * price_at_signal cu co the da qua nhieu gio), va TP/SL dua tren ATR that
 * (bien do thuc te cua coin) thay vi % co dinh tuy tien.
 */
export function useSymbolLevels(symbol: string, adjustedSignal: string, riskLevel: string | null): SymbolLevels {
  const [state, setState] = useState<SymbolLevels>({
    side: 'HOLD',
    entry: null,
    tp: null,
    sl: null,
    atr: null,
    leverage: suggestLeverage(riskLevel),
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fetchDashboardCandles(symbol);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const raw: Candle[] = (data.candles || []).map((c: any) => ({
          ...c,
          open: parseFloat(String(c.open)),
          high: parseFloat(String(c.high)),
          low: parseFloat(String(c.low)),
          close: parseFloat(String(c.close)),
        }));

        if (cancelled) return;
        if (raw.length === 0) {
          setState((s) => ({ ...s, loading: false, error: 'Chua co du lieu nen cho coin nay.' }));
          return;
        }

        const entry = raw[raw.length - 1].close;
        const atr = computeATR(raw, 14);
        const leverage = suggestLeverage(riskLevel);
        const isLong = adjustedSignal === 'BUY';
        const isShort = adjustedSignal === 'SELL';

        if (!isLong && !isShort || !atr) {
          setState({ side: 'HOLD', entry, tp: null, sl: null, atr, leverage, loading: false, error: null });
          return;
        }

        const { tpMult, slMult } = atrMultipliers(riskLevel);
        const tp = isLong ? entry + atr * tpMult : entry - atr * tpMult;
        const sl = isLong ? entry - atr * slMult : entry + atr * slMult;

        setState({
          side: isLong ? 'LONG' : 'SHORT',
          entry,
          tp,
          sl,
          atr,
          leverage,
          loading: false,
          error: null,
        });
      } catch (err) {
        if (!cancelled) {
          setState((s) => ({ ...s, loading: false, error: 'Khong tai duoc du lieu gia moi nhat.' }));
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [symbol, adjustedSignal, riskLevel]);

  return state;
}
