import classNames from "classnames";
import React from "react";

export type PaddedIconProps = {
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  size: "small" | "large";
  backgroundColor?: string;
  iconColor?: string;
  className?: string;
};

const PaddedIcon = (props: PaddedIconProps) => {
  const {
    icon,
    size,
    iconColor = "text-white",
    backgroundColor = "bg-cyan-600",
    className,
  } = props;
  const Icon = icon;

  return (
    <div
      className={classNames(
        className,
        "flex text-white rounded-full",
        backgroundColor,
        {
          "p-1": size === "small",
          "p-2.5": size === "large",
        }
      )}
    >
      <Icon
        className={classNames(iconColor, {
          "h-4 w-4": size === "small",
          "h-5 w-5": size === "large",
        })}
      />
    </div>
  );
};

export default PaddedIcon;
