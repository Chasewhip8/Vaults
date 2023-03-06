import classNames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { LineChart, XAxis, Tooltip, Line, YAxis } from "recharts";
import CustomTooltip from "./CustomTooltip";

type Props = {
  className?: string;
};

const data = [
  { name: "03/01/23", "Your Returns": 1000 },
  { name: "03/02/23", "Your Returns": 1200 },
  { name: "03/03/23", "Your Returns": 1300 },
  { name: "03/04/23", "Your Returns": 1400 },
  { name: "03/05/23", "Your Returns": 1564 },
  { name: "03/06/23", "Your Returns": 1432 },
  { name: "03/07/23", "Your Returns": 1600 },
];

// Add a fake line to show the difference between the user's returns and the
// returns they would have gotten if they didn't use Seagull
// This example is just a 10% reduction in returns
const dataWithAutoCompoundedYield = data.map((entry) => ({
  ...entry,
  "Without Seagull": entry["Your Returns"] * 0.9,
}));

// Find the range of values in the dataset
// This is used to set the range of the Y Axis
const valueRange = [
  Math.min(
    ...dataWithAutoCompoundedYield.map((item) => item["Your Returns"]),
    ...dataWithAutoCompoundedYield.map((item) => item["Without Seagull"])
  ),
  Math.max(
    ...dataWithAutoCompoundedYield.map((item) => item["Your Returns"]),
    ...dataWithAutoCompoundedYield.map((item) => item["Without Seagull"])
  ),
];

const DEFAULT_HEIGHT = 200;

const PortfolioChart = (props: Props) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [chartHeight, setChartHeight] = useState(0);

  useEffect(() => {
    const chartElement = chartRef.current;

    const setChartDimensions = () => {
      if (chartElement) {
        setChartWidth(chartElement.clientWidth);
        setChartHeight(
          chartElement.clientHeight === 0
            ? DEFAULT_HEIGHT
            : chartElement.clientHeight
        );
      }
    };

    // Set the initial dimensions
    setChartDimensions();

    // Add an event listener to update the dimensions when the window is resized
    window.addEventListener("resize", setChartDimensions);

    return () => {
      window.removeEventListener("resize", setChartDimensions);
    };
  }, []);

  return (
    <div
      className={classNames(props.className, "rounded flex-1")}
      ref={chartRef}
    >
      <LineChart
        width={chartWidth}
        height={chartHeight}
        data={dataWithAutoCompoundedYield}
      >
        <XAxis dataKey="name" tick={false} axisLine={false} height={0} />
        <YAxis domain={valueRange} axisLine={false} width={0} />
        <Tooltip
          wrapperStyle={{ outline: "none" }}
          cursor={{ stroke: "#0891b2", strokeWidth: 2 }}
          content={<CustomTooltip />}
        />
        <Line
          type="monotone"
          strokeWidth={3}
          dataKey="Your Returns"
          stroke="#0891b2"
          dot={false}
        />
        <Line
          type="monotone"
          strokeWidth={3}
          dataKey="Without Seagull"
          stroke="#ef4444"
          dot={false}
        />
      </LineChart>
    </div>
  );
};

export default PortfolioChart;
