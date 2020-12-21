import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { regions, regionToPlatform } from "../../components/regions";
import MainLayout from "../../components/main-layout";
import { fetcher } from "../../backend/fetcher";

const Leaderboard = ({ leaderboard }) => {
  const router = useRouter();
  const { region: regionSlug } = router.query;
  const currentRegion = regions.find((r) => r.shortHand === regionSlug); // TODO MOVE TO SERVER PROPS
  return (
    <MainLayout>
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
      <h2 className="font-bold text-4xl">Challenger</h2>
      <ul className="grid grid-cols-1 divide-y divide-white mt-8">
        {leaderboard?.flatMap((entry) => (
          <Link
            key={entry.summonerName}
            href={{
              pathname: "/[region]/players/[playerName]",
              query: { region: entry.region, playerName: entry.summonerName },
            }}
          >
            <li className="flex p-4 items-center cursor-pointer hover:bg-indigo-700">
              <p className="text-2xl font-semibold w-24">{entry.position}</p>{" "}
              <p className="text-2xl font-bold flex-1">{entry.summonerName}</p>
              <div className="flex-auto justify-end">
                <p className="text-l font-bold inline">{entry.leaguePoints}</p> <p className="text-l inline">LP</p>
              </div>
              <div className="flex">
                <p className="text-l font-bold flex-auto text-green-500">{entry.wins}</p> /
                <p className="text-l font-bold flex-auto text-red-500">{entry.losses}</p>
              </div>
              <p className="text-l font-bold flex-auto justify-end">
                {regionSlug === "world" ? entry.region.toUpperCase() : null}
              </p>
            </li>
          </Link>
        ))}
      </ul>
    </MainLayout>
  );
};

// TODO: use getStaticProps and getStaticPaths to statically generate the leaderboard
// Note that you need a direct connection to dynamodb to do this
export const getServerSideProps = async (ctx) => {
  const leaderboard = await fetcher(`http://localhost:3000/api/regions/${ctx.params.region}/leaderboard`);
  return { props: { leaderboard } };
};

export default Leaderboard;
