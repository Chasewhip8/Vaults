import React from "react";
import ProgressBar from "../ProgressBar";

type Props = {
  daysRemaining: number;
  quarter: 1 | 2 | 3 | 4;
};

const VAULT_DURATION = 365;

const VaultProgressBar = (props: Props) => {
  const percentage =
    ((VAULT_DURATION - props.daysRemaining) / VAULT_DURATION) * 100;

  const innerBarColor = () => {
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 50) return "bg-yellow-500";
    if (percentage >= 0) return "bg-green-500";
    return "bg-blue-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex flex-row justify-between text-sm">
        <span className="font-bold">Q{props.quarter}</span>
        <span className="text-gray-400">{props.daysRemaining} days left</span>
      </div>
      <ProgressBar
        progress={percentage}
        innerBarColor={innerBarColor()}
        outerBarColor="bg-gray-400"
      />
    </div>
  );
};

export default VaultProgressBar;
