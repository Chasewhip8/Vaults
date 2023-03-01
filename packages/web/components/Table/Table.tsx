import classNames from "classnames";
import { ReactElement } from "react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

type Props = {
  headers: Array<ReactElement<typeof TableHeader>>;
  rows: Array<ReactElement<typeof TableRow>>;
  className?: string;
};

const Table = (props: Props) => {
  return (
    <div className={classNames(props.className, "flow-root")}>
      <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table className="min-w-full divide-y divide-gray-400">
            <thead>
              <tr>{props.headers}</tr>
            </thead>
            <tbody className="divide-y divide-gray-600">{props.rows}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Table;
