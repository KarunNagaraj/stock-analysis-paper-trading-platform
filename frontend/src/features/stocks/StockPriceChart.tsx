import { useEffect, useRef } from "react";
import {
  CandlestickSeries,
  HistogramSeries,
  createChart,
} from "lightweight-charts";

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

function StockPriceChart({
  historicalPrices,
  height,
  showVolume = false,
}: StockPriceChartProps) {
  const chartContainerRef =
    useRef<HTMLDivElement>(null);//Since the chart is being created in useEffect, the actual div dom element has not been created yet, so we need to use a ref to get a reference to the div that will contain the chart. `
      //Component executes → useRef creates current = null → React renders <div> → React connects <div> to ref → chartContainerRef.current → actual <div>`
    

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
  });

  const candlestickSeries =
    chart.addSeries(CandlestickSeries);

  const candleData =
    normalizeCandlestickData(historicalPrices);

  candlestickSeries.setData(candleData);

  if (showVolume) {
  const volumeSeries = chart.addSeries(
    HistogramSeries,
    {
      priceFormat: {
        type: "volume",
      },
    },
    1
  );

  const volumeData =
    normalizeVolumeData(historicalPrices);

  volumeSeries.setData(volumeData);

  // Make the price pane much larger than the volume pane.
  const panes = chart.panes();

  panes[0]?.setStretchFactor(0.85);
  panes[1]?.setStretchFactor(0.15);
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
}, [historicalPrices, height,showVolume]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full"
    />
  );
}

export default StockPriceChart;