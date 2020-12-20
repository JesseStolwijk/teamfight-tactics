import { useRouter } from "next/router";

const { default: NavigationBar } = require("../../../components/navigation-bar");

const Player = () => {
  const router = useRouter();
  const { name } = router.query;
  return (
    <div className="bg-black min-h-screen text-white">
      <NavigationBar />
      <div>Player: {name} name</div>
    </div>
  );
};

export default Player;
