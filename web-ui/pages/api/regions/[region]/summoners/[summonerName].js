import { saveSummoners } from "../../../../../backend/dynamodb";
import { fetchPlayer } from "../../../../../backend/riot-api";

var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export default async (req, res) => {
  const { region, summonerName } = req.query;

  if (req.method === "POST") {
    const summoner = await fetchPlayer(region, summonerName);

    await saveSummoners(region, [summoner]);

    return res.status(201).json(summoner);
  }

  const params = {
    ExpressionAttributeValues: {
      ":p": { S: `r:${region}-s:${summonerName}` },
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
    }))[0];

    return res.status(200).json(summoner);
  } else {
    return res.status(404).json({ message: "Could not find summoner" });
  }
};
