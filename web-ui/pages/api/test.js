import { ddb } from "../../backend/dynamodb";

var params = {
  ExpressionAttributeValues: {
    ":p": { S: "jesse" },
  },
  KeyConditionExpression: "partition_key = :p",
  TableName: "tft",
};

export default (req, res) => {
  ddb.query(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      res.statusCode = 200;
      res.json({ items: data.Items });
    }
  });
};
