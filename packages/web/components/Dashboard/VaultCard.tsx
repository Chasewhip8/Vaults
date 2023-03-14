import { ArrowsPointingOutIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React, { useMemo } from "react";
import Badge from "../Badge";
import Card from "../Card";
import PaddedIcon from "../PaddedIcon";
import VaultProgressBar from "./VaultProgressBar";

type Props = {
  className?: string;
  onClick?: () => void;
};

const VaultCard = (props: Props) => {
  const title = useMemo(
    () =>
      `${(Math.floor(Math.random() * 10000) / 100).toFixed(2)}
      %`,
    []
  );

  const tokens = useMemo(() => ["SOL", "ETH", "BTC", "LINK", "USDC"], []);
  const bar1 = useMemo(() => Math.floor(Math.random() * 365 * 0.25) + 1, []);
  const bar2 = useMemo(() => Math.floor(Math.random() * 365 * 0.5) + 1, []);
  const bar3 = useMemo(() => Math.floor(Math.random() * 365 * 0.75) + 1, []);
  const bar4 = useMemo(() => Math.floor(Math.random() * 365) + 1, []);
  const composition = useMemo(() => {
    const token1 = tokens[Math.floor(Math.random() * tokens.length)];
    const token2 = tokens.filter((token) => token !== token1)[
      Math.floor(Math.random() * (tokens.length - 1))
    ];

    const ratio = Math.floor(Math.random() * 100) + 1;

    const ratio1 = `${ratio}% ${token1}`;
    const ratio2 = `${100 - ratio}% ${token2}`;

    return [ratio1, ratio2];
  }, [tokens]);

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
            {title ?? ""} <span className="italic text-cyan-500">APR</span>
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
        <VaultProgressBar quarter={1} daysRemaining={bar1 ?? ""} />
        <VaultProgressBar quarter={2} daysRemaining={bar2 ?? ""} />
        <VaultProgressBar quarter={3} daysRemaining={bar3 ?? ""} />
        <VaultProgressBar quarter={4} daysRemaining={bar4 ?? ""} />
      </div>
    </Card>
  );
};

export default VaultCard;
