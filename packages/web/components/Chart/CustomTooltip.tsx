import React from "react";

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
};

const CustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload, label } = props;
  if (active && payload) {
    return (
      <div className="bg-gray-800 p-2 border-white rounded shadow-lg">
        <p>{label}</p>
        <ul>
          {payload.map((item, index) => (
            <li key={index} style={{ color: item.color }}>
              <span className="font-bold">{item.name}: </span>$
              {item.value.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return null;
};

export default CustomTooltip;
