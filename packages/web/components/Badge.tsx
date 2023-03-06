import classNames from "classnames";
import React from "react";

type Props = {
  label: string;
  backgroundColor: string;
};

const Badge = (props: Props) => {
  return (
    <div
      className={classNames(
        props.backgroundColor,
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
      )}
    >
      {props.label}
    </div>
  );
};

export default Badge;
