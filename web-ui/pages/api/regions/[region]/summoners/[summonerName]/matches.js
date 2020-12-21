import { getSummoner } from "../../../../../../backend/dynamodb";
import { fetchMatchHistory } from "../../../../../../backend/riot-api";

export default async (req, res) => {
  const { region, summonerName } = req.query;
  const summoner = await getSummoner(region, summonerName);

  if (summoner) {
    const matches = await fetchMatchHistory(region, summoner.puuid);

    return res.status(200).json(matches);
  } else {
    return res.status(404).json({ message: "Could not find summoner" });
  }
};
