import { useEffect, useRef, useId } from 'react';

interface TradingViewChartProps {
  symbol: string; // vi du: BTCUSDT
  height?: number;
  className?: string;
}

// Nhung widget TradingView chinh hang (mien phi, khong can API key).
// Day la chart THAT cua TradingView, day du cong cu ve/chi bao ky thuat,
// hien thi du lieu Binance THAT (khong phai du lieu tu thu thap cua he thong).
export function TradingViewChart({ symbol, height, className }: TradingViewChartProps) {
  const containerId = useId().replace(/:/g, '-');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = () => {
      // @ts-ignore - TradingView duoc load tu script ngoai, khong co type
      if (window.TradingView && container) {
        // @ts-ignore
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}.P`,
          interval: '60',
          timezone: 'Asia/Ho_Chi_Minh',
          theme: 'dark',
          style: '1',
          locale: 'vi_VN',
          toolbar_bg: '#131722',
          enable_publishing: false,
          allow_symbol_change: true,
          hide_side_toolbar: false, // gia lai toolbar ve (drawing tools) ben trai
          container_id: containerId,
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [symbol, containerId]);

  return (
    <div className={className ?? ''} style={!className ? { height: height ?? 500 } : undefined}>
      <div id={containerId} ref={containerRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
