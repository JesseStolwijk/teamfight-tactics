import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { fetcher } from "../../../backend/fetcher";
import MainLayout from "../../../components/main-layout";
import Image from "next/image";
import match from "../../../backend/match.json";
import { BACKEND_BASE_URL } from "../../../backend/config";

const { default: NavigationBar } = require("../../../components/navigation-bar");

const createUrl = (region, name) => `/api/regions/${region}/summoners/${name}`;

const currentId = "hxJbBzhGHfZQd9kdYX_LnOYmHiIb3e4OtJUzf7tdYj3CnYyAO4EOt02nG09cEzWOvpdUKlw0lSXQMQ";

const Player = ({ player }) => {
  const router = useRouter();
  const { region, name } = router.query;

  const { data, error } = useSWR(createUrl(region, name), fetcher, player);
  const { data: matches, error: matchesError } = useSWR(createUrl(region, name) + "/matches", fetcher);

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

  const participant = match.info.participants.find((participant) => participant.puuid);
  console.log(participant);
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

      <div className="py-8">
        <Match matchInfo={participant} />
        {/* <Match placement={1} gameLength="12:31" champions={["Ashe", "Sett"]} />
        <Match placement={3} gameLength="12:31" champions={["Ashe", "Sett"]} />
        <Match placement={5} gameLength="30:11" champions={["Ashe", "Sett"]} />
        <Match placement={5} gameLength="12:31" champions={["Ashe", "Sett"]} />
        <Match placement={4} gameLength="12:31" champions={["Ashe", "Sett"]} />
        <Match placement={5} gameLength="12:31" champions={["Ashe", "Sett"]} /> */}
      </div>
      <pre>{JSON.stringify(matches, null, 2)}</pre>
    </MainLayout>
  );
};

const getColor = (placement) => {
  switch (placement) {
    case 1:
      return "bg-yellow-400";
    case 2:
      return "bg-gray-400";
    case 3:
      return "bg-yellow-700";
    case 4:
      return "bg-green-400";
    default:
      return "bg-gray-500";
  }
};

const border = (rarity) => {
  switch (rarity + 1) {
    case 1:
      return "border-2 border-gray-300 rounded";
    case 2:
      return "border-2 border-green-300 rounded";
    case 3:
      return "border-2 border-blue-300 rounded";
    case 4:
      return "border-2 border-pink-300 rounded";
    case 5:
      return "border-2 border-yellow-300 rounded";
    default:
      return "";
  }
};

const Match = ({ matchInfo }) => {
  const { placement, time_eliminated, units } = matchInfo;
  const color = getColor(placement);
  return (
    <div className="flex my-2 border border-white cursor-pointer select-none">
      <div className={`${color} w-2`}></div>
      <div className="flex">
        <div className="p-2">
          <div className={`font-bold ${getColor(placement).replace("bg-", "text-")}`}>#{placement}</div>
          <div>{Math.ceil(time_eliminated / 60)} minutes</div>
          <div>10 hours ago</div>
        </div>
        <div className="p-4 font-semibold text-xl">Hunter</div>
        <div className="flex space-x-2 items-center">
          {units
            .sort((a, b) => b.rarity - a.rarity)
            .map((unit) => (
              <div>
                <div key={unit.character_id} className={border(unit.rarity) + " h-12 w-12"}>
                  <ChampionImage championId={unit.character_id} />
                </div>
              </div>
            ))}
        </div>
        <div className="select-text cursor-auto">FrankAugurk Functor GrandVice8</div>
      </div>
    </div>
  );
};

const ChampionImage = ({ championId }) => {
  return (
    <Image
      layout="responsive"
      src={`/set4/champions/${championId}.png`}
      alt={championId.replace("TF4_", "")}
      width="48"
      height="48"
    />
  );
};

const toHumanReadableTimestamp = (epoch) => {
  return new Date(epoch).toLocaleString();
};

export async function getServerSideProps(ctx) {
  const player = await fetcher(BACKEND_BASE_URL + createUrl(ctx.query.region, ctx.query.name));
  return { props: { player } };
}

export default Player;
