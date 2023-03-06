import { Bars3Icon, LinkIcon } from "@heroicons/react/20/solid";
import classNames from "classnames";
import Image from "next/image";
import React from "react";
import Banner from "./Banner";
import Navbar from "./Navbar";

type Props = {
  children: React.ReactNode;
  className?: string;
};

const Layout = (props: Props) => {
  return (
    <div className="bg-slate-900">
      <Banner />
      <Navbar />
      <div
        className={classNames(
          props.className,
          "container mx-auto px-4 sm:px-6 lg:px-8 pt-3"
        )}
      >
        {props.children}
      </div>
    </div>
  );
};

export default Layout;
