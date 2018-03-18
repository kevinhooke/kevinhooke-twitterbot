var AWS = require("aws-sdk");

exports.readNext = function() {
    AWS.config.update({
        region: "us-west-1",
        //endpoint: "http://localhost:8000"
        endpoint : "https://dynamodb.us-west-1.amazonaws.com"
    });

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log("reading next tweet from DynamoDB table");

    //scan query
    var params = {
        TableName: "tweetbottweets",
        ProjectionExpression: "createdate, #tweetdate, tweettext",
        FilterExpression: "#tweetdate = :tweetdate",
        ExpressionAttributeNames: {
            "#tweetdate": "tweetdate"
        },
        ExpressionAttributeValues: {
            ":tweetdate": "0"
        }
    }

    return docClient.scan(params).promise();
}
