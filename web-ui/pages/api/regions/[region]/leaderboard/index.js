import { getLeaderboard } from "../../../../../backend/dynamodb";

export default async (req, res) => {
  const leaderboard = await getLeaderboard(req.query.region, "challenger");
  return res.status(200).json(leaderboard);
};
