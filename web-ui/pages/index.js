import Link from "next/link";
import { useState } from "react";
import NavigationBar from "../components/navigation-bar";
import { regionsWithoutWorld } from "../components/regions";

export default function Home() {
  const [selectedRegion, setSelectedRegion] = useState("euw");
  const [summonerName, setSummonerName] = useState("");

  return (
    <div className="border-white border bg-black text-white grid grid-rows-2 h-screen">
      <div className="border-white border p-4">
        <h2 className="text-2xl font-extrabold">TFT trackr</h2>

        <div className="flex justify-center py-32">
          <div className="flex">
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
            <input
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              className="flex-1 bg-black p-4 border-white border"
              placeholder="Summoner name"
            />
            <Link
              href={{
                pathname: "/[region]/players/[playerName]",
                query: { region: selectedRegion, playerName: summonerName || "empty" },
              }}
            >
              <div className="border-white border p-4 hover:bg-yellow-400 font-bold cursor-pointer">Search</div>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2">
        <Link href="/euw/leaderboard">
          <div className="border-white border p-4 hover:bg-green-500 cursor-pointer">
            <p className="text-2xl font-extrabold">Leaderboard</p>
          </div>
        </Link>
        <Link href="/">
          <div className="border-white border p-4 hover:bg-indigo-700 cursor-pointer">
            <p className="text-2xl font-extrabold line-through">Meta report (Soon TM)</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
