import React, { ReactElement } from "react";
import TableCell from "./TableCell";

type Props = {
  children: Array<ReactElement<typeof TableCell>>;
  onClick?: () => void;
  className?: string;
};

const TableRow = (props: Props) => {
  return (
    <tr onClick={props.onClick} className={props.className}>
      {props.children}
    </tr>
  );
};

export default TableRow;
