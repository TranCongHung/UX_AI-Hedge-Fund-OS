import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickSeries, IChartApi, ISeriesApi } from 'lightweight-charts';
import { computeSupportResistance, Candle } from '@/lib/supportResistance';
import { fetchDashboardCandles } from '@/lib/api';

interface PriceChartProps {
  symbol: string;
  entry?: number | null;
  tp?: number | null;
  sl?: number | null;
  height?: number;
  className?: string;
}

// Chart tu ve tu du lieu market_prices that cua he thong (khong phai TradingView live feed).
// Co the ve them duong Entry/TP/SL/Ho tro/Khang cu vi day la chart do minh dieu khien hoan toan.
// Neu khong truyen height, chart se tu co gian theo kich thuoc cua the cha (dung ResizeObserver).
export function PriceChart({ symbol, entry, tp, sl, height, className }: PriceChartProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [levels, setLevels] = useState<{ support: number[]; resistance: number[] }>({ support: [], resistance: [] });

  useEffect(() => {
    let cancelled = false;
    let series: ISeriesApi<'Candlestick'> | null = null;
    let resizeObserver: ResizeObserver | null = null;

    async function init() {
      if (!containerRef.current) return;

      const initialHeight = height ?? containerRef.current.clientHeight ?? 500;

      const chart = createChart(containerRef.current, {
        height: initialHeight,
        width: containerRef.current.clientWidth,
        layout: {
          background: { type: ColorType.Solid, color: 'transparent' },
          textColor: '#9ca3af',
        },
        grid: {
          vertLines: { color: 'rgba(255,255,255,0.06)' },
          horzLines: { color: 'rgba(255,255,255,0.06)' },
        },
        timeScale: { timeVisible: true },
      });
      chartRef.current = chart;

      // Neu khong co height co dinh, tu dong co gian theo kich thuoc the cha
      if (!height && containerRef.current) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width: w, height: h } = entry.contentRect;
            if (w > 0 && h > 0) chart.applyOptions({ width: w, height: h });
          }
        });
        resizeObserver.observe(containerRef.current);
      }

      series = chart.addSeries(CandlestickSeries, {
        upColor: '#22c55e',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#22c55e',
        wickDownColor: '#ef4444',
      });

      try {
        const res = await fetchDashboardCandles(symbol);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const candles: Candle[] = data.candles || [];

        if (cancelled) return;

        if (candles.length === 0) {
          setError('Chua co du lieu nen cho coin nay trong market_prices.');
          return;
        }

        series.setData(
          candles.map((c) => ({
            time: (new Date(c.open_time).getTime() / 1000) as any,
            open: parseFloat(String(c.open)),
            high: parseFloat(String(c.high)),
            low: parseFloat(String(c.low)),
            close: parseFloat(String(c.close)),
          }))
        );

        // Tinh vung Ho tro/Khang cu tu du lieu nen that, doi chieu voi gia hien tai
        // de dam bao Khang cu luon nam tren, Ho tro luon nam duoi gia hien tai
        const parsedCandles = candles.map((c) => ({
          ...c,
          open: parseFloat(String(c.open)),
          high: parseFloat(String(c.high)),
          low: parseFloat(String(c.low)),
          close: parseFloat(String(c.close)),
        }));
        const lastClose = parsedCandles[parsedCandles.length - 1]?.close;
        const sr = computeSupportResistance(parsedCandles, 2);
        setLevels({
          support: sr.support.map((l) => l.price),
          resistance: sr.resistance.map((l) => l.price),
        });

        // Ve duong Ho tro (xanh la nhat, net dut)
        sr.support.forEach((lvl) => {
          series!.createPriceLine({
            price: lvl.price,
            color: '#4ade80',
            lineWidth: 1,
            lineStyle: 2, // dashed
            axisLabelVisible: true,
            title: `Ho tro (${lvl.strength} lan cham)`,
          });
        });

        // Ve duong Khang cu (do nhat, net dut)
        sr.resistance.forEach((lvl) => {
          series!.createPriceLine({
            price: lvl.price,
            color: '#f87171',
            lineWidth: 1,
            lineStyle: 2,
            axisLabelVisible: true,
            title: `Khang cu (${lvl.strength} lan cham)`,
          });
        });

        // Ve duong Entry/TP/SL neu co
        if (entry) {
          series!.createPriceLine({
            price: entry,
            color: '#60a5fa',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: 'Entry',
          });
        }
        if (tp) {
          series!.createPriceLine({
            price: tp,
            color: '#22c55e',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: 'Take Profit',
          });
        }
        if (sl) {
          series!.createPriceLine({
            price: sl,
            color: '#ef4444',
            lineWidth: 2,
            lineStyle: 0,
            axisLabelVisible: true,
            title: 'Stop Loss',
          });
        }

        chart.timeScale().fitContent();
      } catch (err) {
        if (!cancelled) setError('Khong tai duoc du lieu nen. Kiem tra WF-080 endpoint dashboard-candles da Active chua.');
      }
    }

    init();

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      chartRef.current?.remove();
      chartRef.current = null;
    };
  }, [symbol, entry, tp, sl, height]);

  return (
    <div
      ref={wrapperRef}
      className={className ? `${className} flex flex-col` : ''}
      style={!className ? { height: height ?? 500 } : undefined}
    >
      {error && (
        <div className="text-sm text-destructive mb-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 shrink-0">
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        className={className ? 'flex-1 min-h-0 w-full' : ''}
        style={!className ? { height } : undefined}
      />
      {(levels.support.length > 0 || levels.resistance.length > 0) && (
        <div className="mt-2 flex flex-wrap gap-3 text-xs font-mono text-muted-foreground shrink-0">
          {levels.support.map((p, i) => (
            <span key={`s-${i}`} className="text-green-400">Ho tro: {p.toFixed(4)}</span>
          ))}
          {levels.resistance.map((p, i) => (
            <span key={`r-${i}`} className="text-red-400">Khang cu: {p.toFixed(4)}</span>
          ))}
        </div>
      )}
    </div>
  );
}