import { saveSummoners } from "../../../../../../backend/dynamodb";
import { fetchPlayer } from "../../../../../../backend/riot-api";

export default async (req, res) => {
  const { region, summonerName } = req.query;
  const fetchedSummoner = await fetchPlayer(region, summonerName);

  if (fetchedSummoner) {
    await saveSummoners(region, [fetchedSummoner]);

    return res.status(200).json(fetchedSummoner);
  } else {
    return res.status(404).json({ message: "Could not find summoner" });
  }
};
