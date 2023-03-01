import Card from "@components/Card";
import PaddedIcon from "@components/PaddedIcon";
import Table from "@components/Table/Table";
import TableCell from "@components/Table/TableCell";
import TableHeader from "@components/Table/TableHeader";
import TableRow from "@components/Table/TableRow";
import {
  ArrowsPointingOutIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import React from "react";

const tableRows = [
  {
    vault: "J-Sol-Eth",
    expiration: "(expand)",
    amount: "153.32",
    amountDollar: "$1,532.32",
    percentChange: "5.32%",
  },
  {
    vault: "J-SFXS-USDC",
    expiration: "(expand)",
    amount: "931.25",
    amountDollar: "$10,123.56",
    percentChange: "3.72%",
  },
  {
    vault: "J-BTC-USDT",
    expiration: "(expand)",
    amount: "140.02",
    amountDollar: "$2,312.98",
    percentChange: "2.15%",
  },
  {
    vault: "J-DAI-USDT",
    expiration: "(expand)",
    amount: "876.81",
    amountDollar: "$11,975.27",
    percentChange: "4.28%",
  },
  {
    vault: "J-SOL-USDC",
    expiration: "(expand)",
    amount: "327.98",
    amountDollar: "$6,429.81",
    percentChange: "8.91%",
  },
];

type Props = {};

const YourVaultsCard = (props: Props) => {
  return (
    <Card className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-row justify-between items-start">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Your Vaults</h2>
          <p className="text-gray-400">Track your investments</p>
        </div>
        <PaddedIcon
          className="cursor-pointer hover:shadow-lg hover:scale-110 transition-all duration-200"
          icon={ArrowsPointingOutIcon}
          size="large"
        />
      </div>
      <Table
        className="overflow-y-auto overflow-x-hidden"
        headers={[
          <TableHeader key="Expand" />,
          <TableHeader key="Vault">Vault</TableHeader>,
          <TableHeader key="Expiration">Expiration</TableHeader>,
          <TableHeader key="Amount">Amount</TableHeader>,
          <TableHeader key="Amount ($)">Amount ($)</TableHeader>,
          <TableHeader key="% Change">% Change</TableHeader>,
        ]}
        rows={tableRows.map((row) => (
          <TableRow key="1">
            <TableCell>
              <button className="cursor-pointer hover:scale-125 transition-all duration-200">
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </TableCell>
            <TableCell className="font-bold">{row.vault}</TableCell>
            <TableCell className="italic">{row.expiration}</TableCell>
            <TableCell>{row.amount}</TableCell>
            <TableCell>{row.amountDollar}</TableCell>
            <TableCell>{row.percentChange}</TableCell>
          </TableRow>
        ))}
      />
    </Card>
  );
};

export default YourVaultsCard;
