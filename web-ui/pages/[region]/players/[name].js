import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../../backend/fetcher";
import MainLayout from "../../../components/main-layout";

const { default: NavigationBar } = require("../../../components/navigation-bar");

const createUrl = (region, name) => `http://localhost:3000/api/regions/${region}/summoners/${name}`;

const Player = ({ player }) => {
  const router = useRouter();
  const { region, name } = router.query;

  const { data, error } = useSWR(createUrl(region, name), fetcher, player);

  if (error || data?.message)
    return (
      <div className="bg-black min-h-screen text-white">
        <NavigationBar />
        Unknown error occured
      </div>
    );
  if (!data)
    return (
      <div className="bg-black min-h-screen text-white">
        <NavigationBar />
        <div>Loading...</div>
      </div>
    );

  return (
    <MainLayout>
      <div className="flex">
        <h1 className="font-extrabold text-2xl">{data.summonerName}</h1>
        <p>{region.toUpperCase()}</p>
      </div>
      <button
        onClick={async () => {
          await fetch(createUrl(region, name) + "/refresh");
          mutate(createUrl(region, name));
        }}
      >
        Refresh
      </button>
      <p>
        {data.tier.slice(0, 1)}
        {data.tier.slice(1).toLowerCase()} {data.rank} - {data.leaguePoints} LP
      </p>
      <p>Wins {data.wins}</p>
      <p>Losses {data.losses}</p>
      <p>Updated at {toHumanReadableTimestamp(data.updatedAt)}</p>
    </MainLayout>
  );
};

const toHumanReadableTimestamp = (epoch) => {
  return new Date(epoch).toLocaleString();
};

export async function getServerSideProps(ctx) {
  const player = await fetcher(createUrl(ctx.query.region, ctx.query.name));
  return { props: { player } };
}

export default Player;
