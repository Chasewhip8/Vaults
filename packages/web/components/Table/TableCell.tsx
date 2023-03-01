import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const TableCell = (props: Props) => {
  return (
    <td
      className={classNames(
        props.className,
        "whitespace-nowrap py-4 text-sm text-gray-300 last:pr-4"
      )}
    >
      {props.children}
    </td>
  );
};

export default TableCell;
