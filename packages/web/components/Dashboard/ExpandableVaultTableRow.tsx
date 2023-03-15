import TableCell from "@components/Table/TableCell";
import TableRow from "@components/Table/TableRow";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import React, { useState } from "react";
import { VaultTableRow } from "./YourVaultsCard";

type Props = {
  row: VaultTableRow;
};

const ExpandableVaultTableRow = (props: Props) => {
  const { row } = props;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <TableRow
        key={row.vault}
        onClick={() => setIsExpanded(!isExpanded)}
        className="group hover:bg-gray-600 hover:rounded cursor-pointer transition-all duration-200"
      >
        <TableCell>
          <button className="cursor-pointer group-hover:scale-125 transition-all duration-200">
            <ChevronRightIcon
              className={classNames(
                "h-5 w-5 transition-all duration-200",
                isExpanded && "rotate-90"
              )}
            />
          </button>
        </TableCell>
        <TableCell className="font-bold">Base-{row.vault}</TableCell>
        <TableCell className="italic">{row.expiration}</TableCell>
        <TableCell>{row.amount}</TableCell>
        <TableCell>{row.amountDollar}</TableCell>
        <TableCell>{row.percentChange}</TableCell>
      </TableRow>
      {isExpanded ? (
        <>
          <TableRow key={`Yield-${row.vault}-Q1`}>
            <TableCell></TableCell>
            <TableCell className="font-bold">Yield-{row.vault}-Q1</TableCell>
            <TableCell className="italic">{row.expiration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.amountDollar}</TableCell>
            <TableCell>{row.percentChange}</TableCell>
          </TableRow>
          <TableRow key={`Yield-${row.vault}-Q1`}>
            <TableCell></TableCell>
            <TableCell className="font-bold">Yield-{row.vault}-Q2</TableCell>
            <TableCell className="italic">{row.expiration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.amountDollar}</TableCell>
            <TableCell>{row.percentChange}</TableCell>
          </TableRow>
          <TableRow key={`Yield-${row.vault}-Q1`}>
            <TableCell></TableCell>
            <TableCell className="font-bold">Yield-{row.vault}-Q3</TableCell>
            <TableCell className="italic">{row.expiration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.amountDollar}</TableCell>
            <TableCell>{row.percentChange}</TableCell>
          </TableRow>
          <TableRow key={`Yield-${row.vault}-Q1`}>
            <TableCell></TableCell>
            <TableCell className="font-bold">Yield-{row.vault}-Q4</TableCell>
            <TableCell className="italic">{row.expiration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.amountDollar}</TableCell>
            <TableCell>{row.percentChange}</TableCell>
          </TableRow>
        </>
      ) : null}
    </>
  );
};

export default ExpandableVaultTableRow;
