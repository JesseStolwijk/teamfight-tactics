import { useRouter } from "next/router";

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

Player.getInitialProps = async (ctx) => {
  const player = await fetchPlayer(ctx.query.region, ctx.query.name);
  console.log(player);
  return { player };
};

export default Player;
