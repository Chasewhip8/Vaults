import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React, { useMemo } from "react";
import Badge from "../Badge";
import Card from "../Card";
import PaddedIcon from "../PaddedIcon";
import VaultProgressBar from "./VaultProgressBar";

type Props = {
  apy: number;
  ratio: number;
  token1: string,
  token2: string,
  quarterDaysRemaining: number[];
  className?: string;
  onClick?: () => void;
};

const VaultCard = (props: Props) => {
  const composition = useMemo(() => {
    const ratio1 = `${props.ratio}% ${props.token1}`;
    const ratio2 = `${100 - props.ratio}% ${props.token2}`;

    return [ratio1, ratio2];
  }, [props.ratio, props.token1, props.token2]);

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
            {`${props.apy ?? 0}%`} <span className="italic text-cyan-500">APR</span>
          </h3>
          <div className="flex flex-row space-x-1.5">
            <Badge
              backgroundColor="bg-green-600"
              label={composition[0] ?? ""}
            />
            <Badge
              backgroundColor="bg-purple-600"
              label={composition[1] ?? ""}
            />
          </div>
        </div>
        <PaddedIcon
          className="cursor-pointer group-hover:shadow-lg group-hover:scale-125 transition-all duration-200 active:scale-100"
          icon={ArrowsPointingOutIcon}
          size="large"
        />
      </div>
      <div className="flex flex-col space-y-2 pt-3">
        <VaultProgressBar quarter={1} daysRemaining={props.quarterDaysRemaining[0] ?? ""} />
        <VaultProgressBar quarter={2} daysRemaining={props.quarterDaysRemaining[1] ?? ""} />
        <VaultProgressBar quarter={3} daysRemaining={props.quarterDaysRemaining[2] ?? ""} />
        <VaultProgressBar quarter={4} daysRemaining={props.quarterDaysRemaining[3] ?? ""} />
      </div>
    </Card>
  );
};

export default VaultCard;
