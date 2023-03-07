import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React from "react";
import Badge from "../Badge";
import Card from "../Card";
import PaddedIcon from "../PaddedIcon";
import VaultProgressBar from "./VaultProgressBar";

type Props = {
  className?: string;
  onClick?: () => void;
};

const VaultCard = (props: Props) => {
  return (
    <Card
      onClick={props.onClick}
      className={classNames(
        props.className,
        "group flex flex-col flex-1 cursor-pointer hover:scale-105 transition-all duration-200 active:scale-100"
      )}
    >
      <div className="flex flex-row justify-between items-start">
        <div className="flex flex-col space-y-2">
          <h3 className="text-xl font-extrabold">
            243.33% <span className="italic text-cyan-500">APR</span>
          </h3>
          <div className="flex flex-row space-x-1.5">
            <Badge backgroundColor="bg-green-600" label="50% SOL" />
            <Badge backgroundColor="bg-purple-600" label="50% ETH" />
          </div>
        </div>
        <PaddedIcon
          className="cursor-pointer group-hover:shadow-lg group-hover:scale-125 transition-all duration-200 active:scale-100"
          icon={ArrowsPointingOutIcon}
          size="large"
        />
      </div>
      <div className="flex flex-col space-y-2 pt-3">
        <VaultProgressBar quarter={1} daysRemaining={350} />
        <VaultProgressBar quarter={2} daysRemaining={280} />
        <VaultProgressBar quarter={3} daysRemaining={60} />
        <VaultProgressBar quarter={4} daysRemaining={12} />
      </div>
    </Card>
  );
};

export default VaultCard;
