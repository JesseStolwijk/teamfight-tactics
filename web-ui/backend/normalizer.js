export const normalizeSummonerName = (summonerName) => {
  return summonerName.normalize("NFC").toLowerCase().replace(" ", "");
};
