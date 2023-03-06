import React from "react";

type Props = {};

const Banner = (props: Props) => {
  return (
    <div className="bg-slate-800">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="pr-16 sm:text-center sm:px-16">
          <p className="font-medium text-white">
            <span className="inline">
              Thanks for using Seagull.fi! We&apos;re currently in beta.{" "}
            </span>{" "}
            <a
              href="#"
              className="font-bold underline text-white hover:text-slate-200"
            >
              Learn more <span aria-hidden="true">&rarr;</span>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Banner;
