import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const TableHeader = (props: Props) => {
  return (
    <th
      scope="col"
      className={classNames(
        props.className,
        "py-3.5 text-left text-sm font-bold text-white last:pr-4"
      )}
    >
      {props.children}
    </th>
  );
};

export default TableHeader;
