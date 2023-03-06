import React from "react";
import Image from "next/image";
import { Bars3Icon, LinkIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type Props = {};

const navigation: { name: string; href: string }[] = [];

const Navbar = (props: Props) => {
  return (
    <nav
      className="flex items-center justify-between container mx-auto px-4 sm:px-6 lg:px-8 py-4"
      aria-label="Global"
    >
      <div className="flex lg:flex-1">
        <Link href="/" className="flex items-center space-x-3">
          <div className="block relative h-10 w-10">
            <Image src="/logo.png" alt="Seagull" fill={true} />
          </div>
          <span className="text-white text-4xl font-bold">Seagull Finance</span>
        </Link>
      </div>
      <div className="flex lg:hidden">
        <button
          type="button"
          className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
          // onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open main menu</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>
      <div className="hidden lg:flex lg:gap-x-16">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-lg font-semibold leading-6 text-white"
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <button
          type="button"
          className="inline-flex items-center gap-x-1.5 rounded-md bg-indigo-600 py-2.5 px-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Connect your wallet
          <LinkIcon className="-mr-0.5 h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
