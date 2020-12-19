import React from "react";
import { useRouter } from "next/router";

const Leaderboard = ({ leaderboard }) => {
  const router = useRouter();
  const { region: regionSlug } = router.query;
  const currentRegion = regions.find((r) => r.shortHand === regionSlug); // TODO MOVE TO SERVER PROPS
  return (
    <div className="bg-black text-white p-8">
      {/* <select
        name="region"
        id="region"
        value={currentRegion?.shortHand}
        onChange={(e) => router.push("/leaderboard/" + e.target.value)}
      >
        {regions.map((r) => (
          <option value={r.shortHand}>{r.displayName}</option>
        ))}
      </select> */}
      <div className="pb-8">
        <h1 className="text-4xl">Leaderboard {currentRegion?.displayName}</h1>
      </div>
      <ul className="grid grid-cols-1 divide-y divide-white">
        {leaderboard?.flatMap((entry, index) => (
          <li className="flex p-4 items-center">
            <p className="text-2xl font-bold w-24">{index + 1}</p>{" "}
            <p className="text-2xl font-bold flex-1">{entry.summonerName}</p>
            <p className="text-l font-bold flex-1 justify-end">{entry.leaguePoints} LP</p>{" "}
            <p className="text-xl font-bold flex-auto justify-end">{regionSlug === "world" ? entry.region : null}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const fetchLeaderboard = async (region) => {
  console.log(`Fetching: https://${toRegionToPlatform(region)}.api.riotgames.com/tft/league/v1/challenger`);
  const res = await fetch(`https://${toRegionToPlatform(region)}.api.riotgames.com/tft/league/v1/challenger`, {
    headers: { "X-Riot-Token": "RGAPI-ce2b6f56-1f0e-42d8-ac39-5087a478852b" }, // TODO EXTACT SECRET
  });

  const json = await res.json();
  return { ...json, entries: json.entries.map((entry) => ({ ...entry, region: region })) };
};

const toRegionToPlatform = (region) => {
  return regions.find((r) => r.shortHand === region)?.platformId;
};

export const getStaticProps = async (ctx) => {
  if (ctx.params.region === "world") {
    const rs = await Promise.all(
      regions
        .filter((r) => r.shortHand !== "world")
        .map((r) => r.shortHand)
        .map(fetchLeaderboard)
    );
    return {
      props: {
        leaderboard: rs
          .flatMap((r) => r.entries)
          .sort((a, b) => b.leaguePoints - a.leaguePoints)
          .slice(0, 200),
      },
      revalidate: 60,
    };
  }
  const json = await fetchLeaderboard(ctx.params.region);
  return { props: { leaderboard: json.entries.sort((a, b) => b.leaguePoints - a.leaguePoints) }, revalidate: 60 };
};

const regions = [
  { displayName: "Worldwide", shortHand: "world", platformId: "world" },
  { displayName: "Brazil", shortHand: "br", platformId: "br1" },
  { displayName: "North East Europe", shortHand: "eune", platformId: "eun1" },
  { displayName: "West-Europe", shortHand: "euw", platformId: "euw1" },
  { displayName: "Japan", shortHand: "jp", platformId: "jp1" },
  { displayName: "Korea", shortHand: "kr", platformId: "kr" },
  { displayName: "Latin Amrica", shortHand: "la", platformId: "la1" },
  { displayName: "North America", shortHand: "na", platformId: "na1" },
  { displayName: "Oceania", shortHand: "oce", platformId: "oc1" },
  { displayName: "Turkey", shortHand: "tr", platformId: "tr1" },
];

export async function getStaticPaths() {
  return {
    paths: regions.map((region) => ({
      params: {
        region: region.shortHand,
      },
    })),
    fallback: true,
  };
}

export default Leaderboard;
