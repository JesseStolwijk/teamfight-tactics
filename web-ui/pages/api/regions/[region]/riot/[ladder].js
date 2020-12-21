import { batchWrite, saveSummoners } from "../../../../../backend/dynamodb";
import { RIOT_API_KEY } from "../../../../../backend/config";
import { regionToPlatform } from "../../../../../components/regions";

export default async (req, res) => {
  const { ladder, region } = req.query;

  const result = await fetch(`https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/${ladder}`, {
    headers: { "X-Riot-Token": RIOT_API_KEY },
  });

  const json = await result.json();

  const leaderboard = json.entries
    .sort((a, b) => b.leaguePoints - a.leaguePoints)
    .map((item, index) => ({ ...item, tier: ladder.toUpperCase(), rank: "I", position: index + 1 }));

  await saveSummoners(region, leaderboard);

  await batchWrite(
    leaderboard.map((entry) => ({
      PutRequest: {
        Item: {
          partition_key: { S: `r:${region}-l:${ladder}` },
          created_at: { N: entry.position.toString() },
          summonerName: { S: entry.summonerName },
          // puuid: { S: entry.puuid },
          leaguePoints: { N: entry.leaguePoints.toString() },
          wins: { N: entry.wins.toString() },
          losses: { N: entry.losses.toString() },
          region: { S: region },
          summonerId: { S: entry.summonerId },
          tier: { S: entry.tier },
          rank: { S: entry.rank },
          position: { N: entry.position.toString() },
          updatedAt: { N: Date.now().toString() },
        },
      },
    }))
  );

  res.statusCode = 200;
  res.json({ message: "success" });
};
