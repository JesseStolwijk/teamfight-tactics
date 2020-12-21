import { normalizeSummonerName } from "./normalizer";

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export const saveSummoners = async (region, summoners) => {
  const summonerPutRequests = summoners.map((summoner) => ({
    PutRequest: {
      Item: {
        partition_key: { S: `r:${region}-s:${normalizeSummonerName(summoner.summonerName)}` },
        created_at: { S: "empty" }, //entry.rank.toString() },
        summonerName: { S: summoner.summonerName },
        leaguePoints: { N: summoner.leaguePoints.toString() },
        wins: { N: summoner.wins.toString() },
        losses: { N: summoner.losses.toString() },
        region: { S: region },
        summonerId: { S: summoner.summonerId },
        tier: { S: summoner.tier },
        rank: { S: summoner.rank },
        updatedAt: { N: Date.now().toString() },
      },
    },
  }));

  const chunks = chunk(summonerPutRequests, 25).map((chunk) => ({
    RequestItems: {
      tft: chunk,
    },
  }));

  return await Promise.all(chunks.map((element) => ddb.batchWriteItem(element).promise()));
};

const chunk = (array, chunkSize) => {
  return array.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);
};
