import Card from "@components/Card";
import PaddedIcon, { PaddedIconProps } from "@components/PaddedIcon";
import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/20/solid";
import React from "react";

type Props = {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  iconColor?: PaddedIconProps["iconColor"];
  iconBackgroundColor?: PaddedIconProps["backgroundColor"];
  title: string;
  value: string;
  trend: "up" | "down";
  trendValue?: string;
  trendDescription: React.ReactNode;
};

const OverviewCard = (props: Props) => {
  const {
    icon,
    iconColor,
    iconBackgroundColor,
    title,
    value,
    trend,
    trendDescription,
  } = props;

  return (
    <Card className="flex flex-1 flex-col space-y-4">
      <div className="flex flex-row items-center space-x-3">
        <PaddedIcon
          icon={icon}
          size="large"
          iconColor={iconColor}
          backgroundColor={iconBackgroundColor}
        />
        <h3 className="text-lg font-bold">{title}</h3>
      </div>
      <h2 className="text-3xl font-bold">{value}</h2>
      <div className="flex flex-row items-center space-x-2">
        <PaddedIcon
          icon={trend === "up" ? ArrowTrendingUpIcon : ArrowTrendingDownIcon}
          iconColor={trend === "up" ? "text-green-900" : "text-red-900"}
          backgroundColor={trend === "up" ? "bg-green-400" : "bg-red-400"}
          size="small"
        />
        {trendDescription}
      </div>
    </Card>
  );
};

export default OverviewCard;
