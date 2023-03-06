import classNames from "classnames";
import React from "react";

export type ProgressBarProps = {
  progress: number;
  outerBarColor: string;
  innerBarColor: string;
};

const ProgressBar = (props: ProgressBarProps) => {
  return (
    <div
      className={classNames(
        props.outerBarColor,
        "h-2 w-full rounded-full overflow-hidden"
      )}
    >
      <div
        className={classNames(
          props.innerBarColor,
          "h-full rounded-full transition-all duration-500"
        )}
        style={{ width: `${props.progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
