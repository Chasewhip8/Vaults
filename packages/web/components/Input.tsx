import classNames from "classnames";
import React from "react";
import InputMask from "react-input-mask";

type Props = {
  label?: React.ReactNode;
  type: string;
  name: string;
  id: string;
  placeholder?: string;
  className?: string;
  value: number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const Input = (props: Props) => {
  console.log(props.value)

  return (
    <div className="flex-1">
      {props.label ? <label>{props.label}</label> : null}
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={classNames(
          props.className,
          "block bg-slate-600 w-full rounded-b rounded-r border-0 py-1.5 text-white shadow-sm focus:ring-2 focus:ring-inset focus:ring-cyan-600 sm:text-sm sm:leading-6"
        )}
        placeholder={props.placeholder ?? ""}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
};

export default Input;
