export const regions = [
  { displayName: "Worldwide", shortHand: "world", platformId: "world" },
  { displayName: "Brazil", shortHand: "br", platformId: "br1", routing: "AMERICAS" },
  { displayName: "North East Europe", shortHand: "eune", platformId: "eun1", routing: "EUROPE" },
  { displayName: "West-Europe", shortHand: "euw", platformId: "euw1", routing: "EUROPE" },
  { displayName: "Japan", shortHand: "jp", platformId: "jp1", routing: "ASIA" },
  { displayName: "Korea", shortHand: "kr", platformId: "kr", routing: "ASIA" },
  { displayName: "Latin Amrica", shortHand: "la", platformId: "la1", routing: "AMERICAS" },
  { displayName: "North America", shortHand: "na", platformId: "na1", routing: "AMERICAS" },
  { displayName: "Oceania", shortHand: "oce", platformId: "oc1", routing: "ASIA" },
  { displayName: "Turkey", shortHand: "tr", platformId: "tr1", routing: "EUROPE" },
];

export const regionsWithoutWorld = regions.filter((r) => r.shortHand !== "world");

export const regionToPlatform = (region) => {
  return regions.find((r) => r.shortHand === region)?.platformId;
};

export const regionToRouting = (region) => {
  return regions.find((r) => r.shortHand === region)?.routing;
};
