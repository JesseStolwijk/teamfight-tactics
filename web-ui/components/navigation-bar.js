import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NavigationBar = () => {
  const router = useRouter();
  const { region } = router.query;
  return (
    <nav className="bg-black text-white flex">
      <Link href="/" passHref>
        <div className="p-4 border-white border cursor-pointer">
          <h2 className="text-xl font-bold">TFT trackr</h2>
        </div>
      </Link>
      <div className="flex-1 flex border-white border">
        <input className="flex-1 py-4 px-4 bg-black" placeholder="Search" type="text"></input>
        <p>Search</p>
      </div>
      <NavLink
        href={{
          pathname: "/[region]/leaderboard",
          query: { region },
        }}
        text="Leaderboard"
      />
      <NavLink
        href={{
          pathname: "/[region]/meta",
          query: { region },
        }}
        text="Meta"
      />
      <div className="flex-1 p-4 border-white border">West Europe</div>
    </nav>
  );
};

const NavLink = ({ href, text }) => {
  return (
    <Link href={href} passHref>
      <div className="flex-auto p-4 border-white border cursor-pointer">{text}</div>
    </Link>
  );
};

export default NavigationBar;
