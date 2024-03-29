import classNames from "classnames";
import React from "react";
import Banner from "./Banner";
import Navbar from "./Navbar";
import Providers from "@components/Providers";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const Layout = (props: Props) => {
    return (
        <Providers>
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
        </Providers>
    );
};

export default Layout;
