import { normalizeSummonerName } from "./normalizer";

// Load the AWS SDK for Node.js
var AWS = require("aws-sdk");
// Set the region
const dynamoDBConfig =
  process.env.VERCEL === "1"
    ? {
        region: "eu-west-1",
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_KEY,
        params: {
          TableName: process.env.TABLE_NAME,
        },
      }
    : { region: "eu-west-1" };

AWS.config.update(dynamoDBConfig);

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

export const saveSummoners = async (region, summoners) => {
  console.log(summoners);
  console.log("Store '" + summoners.length + "' summoners in the database");
  const summonerPutRequests = summoners.map((summoner) => ({
    PutRequest: {
      Item: {
        partition_key: { S: `r:${region}-s:${normalizeSummonerName(summoner.summonerName)}` },
        created_at: { N: "123" }, //entry.rank.toString() },
        summonerName: { S: summoner.summonerName },
        puuid: summoner.puuid ? { S: summoner.puuid } : undefined,
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

  return await batchWrite(summonerPutRequests);
};

export const batchWrite = async (requests) => {
  const chunks = chunk(requests, 25).map((chunk) => ({
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

export const getSummoner = async (region, summonerName) => {
  console.log("getSummoner '" + summonerName + "' from region '" + region + "'");

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
      puuid: entry.puuid,
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

export const getLeaderboard = async (region, ladder) => {
  const params = {
    ExpressionAttributeValues: {
      ":p": { S: `r:${region}-l:${ladder}` },
    },
    KeyConditionExpression: "partition_key = :p",
    TableName: "tft",
  };

  const data = await ddb.query(params).promise();

  return data.Items.map(AWS.DynamoDB.Converter.unmarshall);
};
