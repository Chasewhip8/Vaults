import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

const Card = (props: Props) => {
  return (
    <div
      onClick={props.onClick}
      className={classNames(
        props.className,
        "rounded-md shadow bg-slate-700 p-5 text-white"
      )}
    >
      {props.children}
    </div>
  );
};

export default Card;
