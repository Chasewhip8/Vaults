import Card from "@components/Card";
import PortfolioChart from "@components/Chart/PortfolioChart";
import {
  CurrencyDollarIcon,
  ArrowUpCircleIcon,
} from "@heroicons/react/20/solid";
import classNames from "classnames";
import React from "react";

type Props = {
  className?: string;
};

const YourPortfolioCard = (props: Props) => {
  return (
    <Card
      className={classNames(props.className, "flex flex-col justify-between")}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Your Portfolio</h2>
          <p className="text-gray-400 pb-2">Investments over time</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex flex-row items-center space-x-1">
            <p>$541.23</p>
            <CurrencyDollarIcon className="h-5 w-5" />
          </div>
          <div className="flex flex-row items-center space-x-1">
            <p>5.32%</p>
            <ArrowUpCircleIcon className="h-5 w-5" />
          </div>
          <p className="text-gray-400">this past year</p>
        </div>
      </div>
      <PortfolioChart />
    </Card>
  );
};

export default YourPortfolioCard;
