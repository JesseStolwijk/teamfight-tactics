import React from "react";
import { useRouter } from "next/router";
import NavigationBar from "../../components/navigation-bar";
import Link from "next/link";
import { regions, regionToPlatform } from "../../components/regions";
import { RIOT_API_KEY } from "../../backend/secrets";
import MainLayout from "../../components/main-layout";

const Leaderboard = ({ leaderboard }) => {
  const router = useRouter();
  const { region: regionSlug } = router.query;
  const currentRegion = regions.find((r) => r.shortHand === regionSlug); // TODO MOVE TO SERVER PROPS
  return (
    <MainLayout>
      <div className="p-8">
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
        {/* <div className="pb-8">
          <h1 className="text-4xl">Leaderboard {currentRegion?.displayName}</h1>
        </div> */}
        <ul className="grid grid-cols-1 divide-y divide-white">
          {leaderboard?.flatMap((entry, index) => (
            <Link
              key={entry.summonerName}
              href={{
                pathname: "/[region]/players/[playerName]",
                query: { region: entry.region, playerName: entry.summonerName },
              }}
            >
              <li className="flex p-4 items-center cursor-pointer hover:bg-indigo-700">
                <p className="text-2xl font-semibold w-24">{index + 1}</p>{" "}
                <p className="text-2xl font-bold flex-1">{entry.summonerName}</p>
                <div className="flex-auto justify-end">
                  <p className="text-l font-bold inline">{entry.leaguePoints}</p> <p className="text-l inline">LP</p>
                </div>
                <p className="text-l font-bold flex-auto justify-end">
                  {regionSlug === "world" ? entry.region.toUpperCase() : null}
                </p>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    </MainLayout>
  );
};

const fetchLeaderboard = async (region) => {
  console.log(`Fetching: https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/challenger`);
  const res = await fetch(`https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/challenger`, {
    headers: { "X-Riot-Token": RIOT_API_KEY }, // TODO EXTACT SECRET
  });

  const json = await res.json();
  return { ...json, entries: json.entries.map((entry) => ({ ...entry, region: region })) };
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
