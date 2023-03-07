import classNames from "classnames";
import React from "react";

type Props = {
  label: string;
  backgroundColor: string;
  size?: "small" | "large";
};

const Badge = ({
  size = "small",
  label,
  backgroundColor = "bg-cyan-500",
}: Props) => {
  return (
    <div
      className={classNames(
        backgroundColor,
        size === "large" ? "text-sm px-3 py-0.5" : "text-xs px-2.5 py-0.5",
        "inline-flex items-center rounded-full font-medium text-white"
      )}
    >
      {label}
    </div>
  );
};

export default Badge;
