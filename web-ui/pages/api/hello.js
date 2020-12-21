// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { BACKEND_BASE_URL } from "../../backend/config";

export default (req, res) => {
  res.statusCode = 200;
  res.json({
    url: BACKEND_BASE_URL,
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    TableName: process.env.TABLE_NAME,
  });
};
