var AWS = require("aws-sdk");
// Set the region
AWS.config.update({ region: "eu-west-1" });

// Create DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

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
