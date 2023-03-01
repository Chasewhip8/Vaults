import React, { ReactElement } from "react";
import TableCell from "./TableCell";

type Props = {
  children: Array<ReactElement<typeof TableCell>>;
};

const TableRow = (props: Props) => {
  return <tr>{props.children}</tr>;
};

export default TableRow;
