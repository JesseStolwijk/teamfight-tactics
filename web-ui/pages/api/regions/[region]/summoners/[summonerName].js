import { getSummoner, saveSummoners } from "../../../../../backend/dynamodb";
import { fetchPlayer } from "../../../../../backend/riot-api";
import refresh from "./[summonerName]/refresh";

export default async (req, res) => {
  const { region, summonerName } = req.query;

  if (req.method === "GET") {
    const summoner = await getSummoner(region, summonerName);

    if (summoner) {
      if (!summoner.puuid) {
        return refresh(req, res);
      }

      return res.status(200).json(summoner);
    } else {
      const fetchedSummoner = await fetchPlayer(region, summonerName);

      if (fetchedSummoner) {
        await saveSummoners(region, [fetchedSummoner]);

        return res.status(200).json(fetchedSummoner);
      }

      return res.status(404).json({ message: "Could not find summoner" });
    }
  }
  return res.status(404).json({ message: "HTTP Method not supported" });
};
