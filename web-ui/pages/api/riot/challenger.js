import { regionToPlatform } from "../../../components/regions";

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export default async (req, res) => {
  const region = "euw";

  const result = await fetch(`https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/challenger`, {
    headers: { "X-Riot-Token": "RGAPI-11e65366-e8bc-4dc5-91ee-7d534900c748" }, // TODO EXTACT SECRET
  });

  const json = await result.json();

  const leaderboard = json.entries
    .sort((a, b) => b.leaguePoints - a.leaguePoints)
    .map((item, index) => ({ ...item, rank: index + 1 }))
    .map((entry) => ({
      PutRequest: {
        Item: {
          partition_key: { S: `r:${region}-s:${entry.summonerName}` },
          created_at: { S: "empty" }, //entry.rank.toString() },
          summonerName: { S: entry.summonerName },
          leaguePoints: { N: entry.leaguePoints.toString() },
          wins: { N: entry.wins.toString() },
          losses: { N: entry.losses.toString() },
          region: { S: region },
          summonerId: { S: entry.summonerId },
        },
      },
    }));

  const chunks = chunk(leaderboard, 25).map((chunk) => ({
    RequestItems: {
      tft: chunk,
    },
  }));

  await Promise.all(chunks.map((element) => ddb.batchWriteItem(element).promise()));

  // await ddb
  //   .batchWriteItem({
  //     RequestItems: {
  //       tft: [
  //         {
  //           PutRequest: {
  //             Item: {
  //               partition_key: { S: `r:${region}-tier:challenger` },
  //               created_at: { S: "123" },
  //               leaderboard: { L: leaderboard.map((item) => ({ M: item.PutRequest.Item })) },
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   })
  //   .promise();

  res.statusCode = 200;
  res.json({ message: "success" });
};

const chunk = (array, chunkSize) => {
  return array.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
};
