import classNames from "classnames";

type Props = {
  className?: string;
  fields: {
    title: string;
    content: string | React.ReactNode;
    columns?: "one" | "two" | "three";
  }[];
};

const ColumnDisplay = ({ className, fields }: Props) => {
  return (
    <dl
      className={classNames(
        "grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3",
        className
      )}
    >
      {fields.map((field) => (
        <div
          key={field.title}
          className={classNames(
            field.columns === "three" && "sm:col-span-3",
            field.columns === "two" && "sm:col-span-2",
            field.columns === "one" ||
              (field.columns === undefined && "sm:col-span-1")
          )}
        >
          <dt className="text-sm font-bold text-white">{field.title}</dt>
          <dd className="mt-1 text-sm text-gray-400">
            {field.content || <span className="text-gray-400">Empty</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
};

export default ColumnDisplay;
