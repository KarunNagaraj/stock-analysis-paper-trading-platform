import { useEffect, useRef, useState } from "react";
import {
  CandlestickSeries,
  HistogramSeries,
  createChart,
  CrosshairMode,
  type ISeriesApi
} from "lightweight-charts";

type TooltipData = {
  x: number;
  y: number;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type HistoricalPrice = {
  trading_date: string;
  open_price: string;
  high_price: string;
  low_price: string;
  close_price: string;
  volume: number;
};

type CandlestickData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type StockPriceChartProps = {
  historicalPrices: HistoricalPrice[];
  height: number;
  showVolume?: boolean;
  showTooltip?: boolean;
};

type VolumeData = {
  time: string;
  value: number;
};

function normalizeVolumeData(
  prices: HistoricalPrice[]
): VolumeData[] {
  return prices.map((price) => ({
    time: price.trading_date.split("T")[0],
    value: price.volume,
  }));
}

function normalizeCandlestickData(
  prices: HistoricalPrice[]
): CandlestickData[] {
  return prices.map((price) => ({
    time: price.trading_date.split("T")[0],
    open: Number(price.open_price),
    high: Number(price.high_price),
    low: Number(price.low_price),
    close: Number(price.close_price),
  }));
}
function formatVolume(volume: number): string {
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }

  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(2)}K`;
  }

  return volume.toString();
}
function StockPriceChart({
  historicalPrices,
  height,
  showVolume = false,
  showTooltip = false
}: StockPriceChartProps) {

  const chartContainerRef = useRef<HTMLDivElement>(null);//Since the chart is being created in useEffect, the actual div dom element has not been created yet, so we need to use a ref to get a reference to the div that will contain the chart. `
      //Component executes → useRef creates current = null → React renders <div> → React connects <div> to ref → chartContainerRef.current → actual <div>`
    
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  useEffect(() => {
  if (!chartContainerRef.current) {
    return; //has the div been created yet? If not, return early. This is a safety check to ensure that the chart is only created when the div is available in the DOM.
  }

  if (historicalPrices.length === 0) {
    return;
  }

  const chartContainer = chartContainerRef.current;

  const chart = createChart(chartContainer, {
  width: chartContainer.clientWidth,
  height,

  crosshair: {
    mode: CrosshairMode.Magnet,

    vertLine: {
      visible: true,
      labelVisible: true,
    },

    horzLine: {
      visible: true,
      labelVisible: true,
    },
  },
});

  const candlestickSeries = chart.addSeries(CandlestickSeries);

  const candleData = normalizeCandlestickData(historicalPrices);

  candlestickSeries.setData(candleData);

  let volumeSeries: ISeriesApi<"Histogram"> | undefined;

  if (showVolume) {
  volumeSeries = chart.addSeries(
    HistogramSeries,
    {
      priceFormat: {
        type: "volume",
      },
    },
    1
  );

  const volumeData = normalizeVolumeData(historicalPrices);

  volumeSeries.setData(volumeData);

  // Make the price pane much larger than the volume pane.
  const panes = chart.panes();

  panes[0]?.setStretchFactor(0.85);
  panes[1]?.setStretchFactor(0.15);
}

if (showTooltip) {
  chart.subscribeCrosshairMove((param) => { //Lightweight Charts gives our callback an object containing information about the crosshair event.
    if (
      !param.point || //The param object contains details about the x,y coordinates of the crosshair
      !param.time || //This relates to the time/date of the x axis of crosshair
      !param.seriesData //This contains the OHLC data as candlestickSeries and volume data as volumeSeries.
    ) {
      setTooltip(null);
      return;
    }

    const candle = param.seriesData.get(candlestickSeries) as | CandlestickData| undefined;

    if (!candle) {
      setTooltip(null);
      return;
    }

    let volume = 0;

    if (volumeSeries) {
      const volumeData = param.seriesData.get(volumeSeries) as | VolumeData| undefined;

      if (volumeData) {
        volume = volumeData.value;
      }
    }

    setTooltip({
      x: param.point.x,
      y: param.point.y,
      date: candle.time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume,
    });
  });
}
  chart.timeScale().fitContent();

  const resizeObserver = new ResizeObserver(() => {
    chart.resize(
      chartContainer.clientWidth,
      height
    );
  }); //resizeObserver is a built-in browser API that allows you to observe changes to the size of an element. In this case, we are observing the chartContainer div and resizing the chart whenever the container's size changes.
  // "Whenever the observed element changes size, resize the chart to match it."
  resizeObserver.observe(chartContainer); //Start watching this particular <div>.

  return () => {
    resizeObserver.disconnect();
    chart.remove();
  };
}, [historicalPrices, height,showVolume,showTooltip]);

  return (
  <div
    ref={chartContainerRef}
    className="relative w-full"
  >
    {showTooltip && tooltip && (
      <div
        className="pointer-events-none absolute z-10 rounded-lg bg-white p-3 text-sm shadow-lg"
        style={{
          left: tooltip.x + 15,
          top: tooltip.y + 15,
        }}
      >
        <div className="font-semibold">
          {tooltip.date}
        </div>

        <div className="mt-2 space-y-1">
          <div>
            Open: {tooltip.open.toFixed(2) /* converts to string */}
          </div>

          <div>
            High: {tooltip.high.toFixed(2)}
          </div>

          <div>
            Low: {tooltip.low.toFixed(2)}
          </div>

          <div>
            Close: {tooltip.close.toFixed(2)}
          </div>

          <div>
            Volume: {formatVolume(tooltip.volume)}
          </div>
        </div>
      </div>
    )}
  </div>
);
}

export default StockPriceChart;

/*                    USER
                      │
                      │ moves mouse
                      ▼
             Lightweight Charts
                      │
                      │ crosshair moves
                      ▼
        subscribeCrosshairMove(callback)
                      │
                      │ gives `param`
                      ▼
             ┌─────────────────┐
             │      param      │
             │                 │
             │ point           │──── x/y
             │ time            │
             │ seriesData      │──── candle/volume
             └─────────────────┘
                      │
                      ▼
              Extract candle
                      │
              ┌───────┴────────┐
              ▼                ▼
          OHLC data          volume
              │                │
              └───────┬────────┘
                      ▼
               setTooltip(...)
                      │
                      ▼
                React state
                      │
                      ▼
                 re-render
                      │
                      ▼
        showTooltip && tooltip
                      │
                      ▼
              Render <div>
                      │
                      ▼
             left: x + 15
             top:  y + 15
                      │
                      ▼
                TOOLTIP*/