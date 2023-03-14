import { Combobox } from "@headlessui/react";
import React, { useState } from "react";

type Props = {};

const quarters: string[] = ["Q1", "Q2", "Q3", "Q4"];

const VaultInput = () => {
  const [quarter, setSelectedQuarter] = useState(quarters[0]);

  return (
    <div>
      <label
        htmlFor="quarter"
        className="block text-xl font-medium leading-6 text-white"
      >
        Select Vault
      </label>
      <select
        id="quarter"
        name="quarter"
        className="bg-slate-600 font-bold text-md mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-white focus:ring-2 focus:ring-cyan-600 sm:leading-6"
        defaultValue="Q1"
      >
        {quarters.map((quarter) => (
          <option
            className="text-md font-bold"
            key={quarter}
            onClick={() => setSelectedQuarter(quarter)}
          >
            {quarter}
          </option>
        ))}
      </select>
    </div>
  );
};

export default VaultInput;
