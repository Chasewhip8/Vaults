import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import React from "react";
import Badge from "../Badge";
import Card from "../Card";
import PaddedIcon from "../PaddedIcon";
import VaultProgressBar from "./VaultProgressBar";

type Props = {};

const VaultCard = (props: Props) => {
  return (
    <Card className="flex flex-col flex-1">
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
          className="cursor-pointer hover:shadow-lg hover:scale-110 transition-all duration-200 active:scale-100"
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
