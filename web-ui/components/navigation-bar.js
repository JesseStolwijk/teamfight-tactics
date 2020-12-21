import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { regionsWithoutWorld } from "./regions";

const NavigationBar = () => {
  const router = useRouter();
  const { region } = router.query;

  const [selectedRegion, setSelectedRegion] = useState(region);
  const [playerName, setPlayerName] = useState("");

  return (
    <nav className="bg-black text-white flex">
      <Link href="/" passHref>
        <div className="p-4 border-white border cursor-pointer">
          <h2 className="text-xl font-bold">TFT trackr</h2>
        </div>
      </Link>
      <select
        id="region"
        className="bg-black border border-white"
        value={selectedRegion}
        defaultValue={selectedRegion}
        onChange={(e) => setSelectedRegion(e.target.value)}
      >
        {regionsWithoutWorld.map((region) => (
          <option value={region.shortHand}>{region.shortHand.toUpperCase()}</option>
        ))}
      </select>
      <div className="flex-1 flex border-white border items-center">
        <input
          className="flex-1 py-4 px-4 bg-black"
          placeholder="Search"
          type="text"
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              router.push(`/${selectedRegion}/players/${playerName}`);
            }
          }}
        ></input>
        <Link
          className="p-2"
          href={{ pathname: "/[region]/players/[playerName]", query: { selectedRegion, playerName } }}
        >
          Search
        </Link>
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
