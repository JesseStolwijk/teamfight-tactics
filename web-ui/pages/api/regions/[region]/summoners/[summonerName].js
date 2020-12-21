import { saveSummoners } from "../../../../../backend/dynamodb";
import { normalizeSummonerName } from "../../../../../backend/normalizer";
import { fetchPlayer } from "../../../../../backend/riot-api";

const AWS = require("aws-sdk");

AWS.config.update({ region: "eu-west-1" });

const ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const getSummonerFromDatabase = async (region, summonerName) => {
  const params = {
    ExpressionAttributeValues: {
      ":p": { S: `r:${region}-s:${normalizeSummonerName(summonerName)}` },
    },
    KeyConditionExpression: "partition_key = :p",
    TableName: "tft",
  };

  const data = await ddb.query(params).promise();

  if (data?.Items?.length === 1) {
    const summoner = data.Items.map(AWS.DynamoDB.Converter.unmarshall).map((entry) => ({
      summonerId: entry.summonerId,
      summonerName: entry.summonerName,
      region: entry.region,
      wins: entry.wins,
      losses: entry.losses,
      leaguePoints: entry.leaguePoints,
      tier: entry.tier,
      rank: entry.rank,
      position: entry.position,
      updatedAt: entry.updatedAt,
    }))[0];
    return summoner;
  } else {
    return null;
  }
};

export default async (req, res) => {
  const { region, summonerName } = req.query;

  if (req.method === "GET") {
    const summoner = await getSummonerFromDatabase(region, summonerName);

    if (summoner) {
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
