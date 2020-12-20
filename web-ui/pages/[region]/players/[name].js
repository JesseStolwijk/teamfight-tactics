import { useRouter } from "next/router";
import { regionToPlatform } from "../../../components/regions";

const { default: NavigationBar } = require("../../../components/navigation-bar");

const Player = ({ player }) => {
  const router = useRouter();
  const { region } = router.query;
  return (
    <div className="bg-black min-h-screen text-white">
      <NavigationBar />
      <div className="border border-white p-4 m-4">
        <div className="flex">
          <h1 className="font-extrabold text-2xl">{player.name}</h1>
          <p>{region.toUpperCase()}</p>
        </div>
        <p>
          {player.tier.slice(0, 1)}
          {player.tier.slice(1).toLowerCase()} - {player.rank}
        </p>
        <p>Wins {player.wins}</p>
        <p>Losses {player.losses}</p>
      </div>
    </div>
  );
};

const fetchPlayer = async (region, name) => {
  const res = await fetch(
    `https://${regionToPlatform(region)}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`,
    {
      headers: { "X-Riot-Token": "RGAPI-ce2b6f56-1f0e-42d8-ac39-5087a478852b" }, // TODO EXTACT SECRET
    }
  );

  const json = await res.json();

  const res2 = await fetch(
    `https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/entries/by-summoner/${json.id}`,
    {
      headers: { "X-Riot-Token": "RGAPI-ce2b6f56-1f0e-42d8-ac39-5087a478852b" }, // TODO EXTACT SECRET
    }
  );

  return { ...json, ...(await res2.json())[0] };
};

Player.getInitialProps = async (ctx) => {
  const player = await fetchPlayer(ctx.query.region, ctx.query.name);
  console.log(player);
  return { player };
};

export default Player;
