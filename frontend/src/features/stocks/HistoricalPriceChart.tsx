import { useEffect, useRef, useState } from "react";
import { CandlestickSeries,createChart } from "lightweight-charts";
import { getHistoricalPrices } from "../../services/stockService";
import { Link } from "react-router-dom";

type HistoricalPrice = {
  trading_date: string;
  open_price: string;
  high_price: string;
  low_price: string;
  close_price: string;
  volume: number;
};

type HistoricalPriceChartProps = {
  symbol: string;
};

type CandlestickData = {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
};

type VolumeData = {
  time: string;
  value: number;
};

function normalizeCandlestickData(
  prices: HistoricalPrice[]
): CandlestickData[] {
  return prices.map((price) => ({
    time: price.trading_date.split("T")[0], //split the date string into a list and take the first element (the date)
    open: Number(price.open_price),
    high: Number(price.high_price),
    low: Number(price.low_price),
    close: Number(price.close_price),
  }));
}


function normalizeVolumeData(
  prices: HistoricalPrice[]
): VolumeData[] {
  return prices.map((price) => ({
    time: price.trading_date.split("T")[0],
    value: price.volume,
  }));
}

function HistoricalPriceChart({
  symbol,
}: HistoricalPriceChartProps) {
  const [historicalPrices, setHistoricalPrices] = useState<HistoricalPrice[]>([]);

  const chartContainerRef = useRef<HTMLDivElement>(null); //Since the chart is being created in useEffect, the actual div dom element has not been created yet, so we need to use a ref to get a reference to the div that will contain the chart. `
  //Component executes → useRef creates current = null → React renders <div> → React connects <div> to ref → chartContainerRef.current → actual <div>`

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHistoricalPrices() {
      try {
        setLoading(true);
        setError("");

        const data = await getHistoricalPrices(symbol);

        setHistoricalPrices(data);
      } catch (error) {
        console.error(error);
        setError("Unable to load historical prices");
      } finally {
        setLoading(false);
      }
    }

    loadHistoricalPrices();
  }, [symbol]);

  useEffect(() => {
  if (!chartContainerRef.current) {
    return; //"Do I actually have the <div> that will contain the chart?"
  }

  if (historicalPrices.length === 0) {
    return;
  }

  const chart = createChart(chartContainerRef.current, {
    width: chartContainerRef.current.clientWidth,
    height: 400,
  }); /*createChart(
    WHERE_TO_RENDER,
    HOW_THE_CHART_SHOULD_BE_CONFIGURED
)*/

  const candlestickSeries = chart.addSeries(CandlestickSeries); //adding a candlestick series to the chart, in terms of functionality basically

  const candleData = normalizeCandlestickData(historicalPrices); //normalize the data to be in the format that the chart library expects

  candlestickSeries.setData(candleData); 

  chart.timeScale().fitContent(); //"Adjust the visible time scale so the available data fits into the chart."

  return () => {
    chart.remove(); //Before this effect is run again, or when the component is removed, destroy the chart that we created

  };
}, [historicalPrices]); 
  if (loading) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Historical Data
        </h2>

        <p className="mt-4 text-gray-500">
          Loading historical data...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">
          Historical Data
        </h2>

        <p className="mt-4 text-red-500">
          {error}
        </p>
      </div>
    );
  }

  return (
  <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
    <h2 className="text-xl font-semibold">
      Historical Data
    </h2>

    <div
      ref={chartContainerRef}
      className="mt-4 w-full"
    />
  </div>
);
}

export default HistoricalPriceChart;