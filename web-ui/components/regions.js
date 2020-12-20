export const regions = [
  { displayName: "Worldwide", shortHand: "world", platformId: "world" },
  { displayName: "Brazil", shortHand: "br", platformId: "br1" },
  { displayName: "North East Europe", shortHand: "eune", platformId: "eun1" },
  { displayName: "West-Europe", shortHand: "euw", platformId: "euw1" },
  { displayName: "Japan", shortHand: "jp", platformId: "jp1" },
  { displayName: "Korea", shortHand: "kr", platformId: "kr" },
  { displayName: "Latin Amrica", shortHand: "la", platformId: "la1" },
  { displayName: "North America", shortHand: "na", platformId: "na1" },
  { displayName: "Oceania", shortHand: "oce", platformId: "oc1" },
  { displayName: "Turkey", shortHand: "tr", platformId: "tr1" },
];

export const regionsWithoutWorld = regions.filter((r) => r.shortHand !== "world");

export const regionToPlatform = (region) => {
  return regions.find((r) => r.shortHand === region)?.platformId;
};
