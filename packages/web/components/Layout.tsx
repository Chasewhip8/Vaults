import classNames from "classnames";
import React from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Layout = (props: Props) => {
  return (
    <div className={classNames(props.className, "bg-slate-900")}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
