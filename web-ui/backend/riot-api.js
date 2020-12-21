import { regionToPlatform, regionToRouting } from "../components/regions";
import { RIOT_API_KEY } from "./secrets";

export const fetchPlayer = async (region, name) => {
  const res = await fetch(
    `https://${regionToPlatform(region)}.api.riotgames.com/tft/summoner/v1/summoners/by-name/${name}`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY }, // TODO EXTACT SECRET
    }
  );

  const json = await res.json();

  const res2 = await fetch(
    `https://${regionToPlatform(region)}.api.riotgames.com/tft/league/v1/entries/by-summoner/${json.id}`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY }, // TODO EXTACT SECRET
    }
  );

  const player = { ...json, ...(await res2.json())[0] };

  console.log("Fetched player: ", player);
  return player;
};

export const fetchMatchHistory = async (region, puuid) => {
  const res = await fetch(
    `https://${regionToRouting(region)}.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?count=999999`,
    {
      headers: { "X-Riot-Token": RIOT_API_KEY }, // TODO EXTACT SECRET
    }
  );

  return await res.json();
};
